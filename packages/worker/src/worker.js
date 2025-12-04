import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// CONFIG
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const JUDGE0_URL = process.env.JUDGE0_URL || 'http://127.0.0.1:2358'; 
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algoverse';

console.log('------------------------------------------------');
console.log('Worker Starting...');
console.log(`Target MongoDB URI: ${MONGO_URI}`);
console.log('------------------------------------------------');

// --- FIX: USE EXPLICIT CONNECTION ---
// Instead of the global mongoose.connect, we create a dedicated connection instance.
// This prevents conflicts with other mongoose versions in the monorepo.
const dbConnection = mongoose.createConnection(MONGO_URI, {
    family: 4, // Force IPv4
    serverSelectionTimeoutMS: 5000
});

dbConnection.on('connected', () => console.log('✅ [Mongoose] Explicit Connection Established'));
dbConnection.on('disconnected', () => console.log('⚠️ [Mongoose] Disconnected'));
dbConnection.on('error', (err) => console.error('❌ [Mongoose] Error:', err));

// --- SCHEMA DEFINITION ---
const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: String, required: true },
    languageId: { type: Number, required: true }, 
    status: { type: String, default: 'Pending' },
    runtime: { type: Number, default: 0 }, 
    memory: { type: Number, default: 0 }, 
    executionLogs: { type: String }, 
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
}, { timestamps: true });

// BIND MODEL TO THE EXPLICIT CONNECTION
// We use 'SubmissionModel' to distinguish it from any imported versions
const SubmissionModel = dbConnection.model('Submission', submissionSchema);

// Helper Functions
const toBase64 = (str) => Buffer.from(str).toString('base64');
const fromBase64 = (str) => Buffer.from(str, 'base64').toString('utf-8');

const worker = new Worker('submission-queue', async job => {
    const { submissionId, code, languageId, testCases, timeLimit, memoryLimit } = job.data;
    console.log(`[Job ${submissionId}] Processing...`);

    // Wait for connection if not ready
    if (dbConnection.readyState !== 1) {
        console.log('Waiting for DB connection...');
        await new Promise(resolve => dbConnection.once('connected', resolve));
    }

    try {
        let allPassed = true;
        let totalRuntime = 0;
        let maxMemory = 0;
        let failureReason = null;
        let failedStatus = null;

        for (const testCase of testCases) {
            const payload = {
                source_code: toBase64(code),
                language_id: languageId,
                stdin: toBase64(testCase.input),
                expected_output: toBase64(testCase.output),
                cpu_time_limit: timeLimit / 1000, 
                memory_limit: memoryLimit * 1024, 
            };

            const response = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, payload);
            const result = response.data;

            if (result.status.id !== 3) {
                allPassed = false;
                failedStatus = result.status.description;
                failureReason = result.compile_output ? fromBase64(result.compile_output) : result.status.description;
                break; 
            }

            const runTimeMs = result.time ? parseFloat(result.time) * 1000 : 0;
            totalRuntime = Math.max(totalRuntime, runTimeMs);
            maxMemory = Math.max(maxMemory, result.memory || 0);
        }

        const finalStatus = allPassed ? 'Accepted' : (failedStatus || 'Wrong Answer');
        
        // Use the explicitly bound model
        await SubmissionModel.findByIdAndUpdate(submissionId, {
            status: finalStatus,
            runtime: totalRuntime,
            memory: maxMemory,
            passedTestCases: allPassed ? testCases.length : 0, 
            totalTestCases: testCases.length,
            executionLogs: failureReason
        });

        console.log(`[Job ${submissionId}] Finished: ${finalStatus}`);

    } catch (err) {
        console.error(`[Job ${submissionId}] FAILED:`, err.message);
        
        try {
            await SubmissionModel.findByIdAndUpdate(submissionId, {
                status: 'Runtime Error',
                executionLogs: err.code === 'ECONNREFUSED' 
                    ? 'Execution Engine Unavailable' 
                    : err.message
            });
        } catch (dbErr) {
            console.error('CRITICAL: Could not update status in DB', dbErr.message);
        }
    }
}, { 
    connection: { host: REDIS_HOST, port: REDIS_PORT } 
});