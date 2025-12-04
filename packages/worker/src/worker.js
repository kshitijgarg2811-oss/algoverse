import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Submission from '../../server/src/models/submission.js'; // Import shared model schema
// Note: In a real monorepo, you'd usually compile models to a shared lib, 
// but for this structure, ensure the path resolves or duplicate the schema.

dotenv.config();

// Config
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358'; // Localhost if running outside docker, or 'http://judge0-server:2358' if inside

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algoverse')
    .then(() => console.log('Worker DB Connected'))
    .catch(err => console.error('Worker DB Error', err));

// Helper: Encode to Base64 (Judge0 requirement)
const toBase64 = (str) => Buffer.from(str).toString('base64');
const fromBase64 = (str) => Buffer.from(str, 'base64').toString('utf-8');

const worker = new Worker('submission-queue', async job => {
    const { submissionId, code, languageId, testCases, timeLimit, memoryLimit } = job.data;
    console.log(`Processing submission: ${submissionId}`);

    try {
        let allPassed = true;
        let totalRuntime = 0;
        let maxMemory = 0;
        let failureReason = null;
        let failedStatus = null;

        // BATCH EXECUTION STRATEGY
        // We will send all test cases to Judge0 in batch if supported, 
        // or loop them. For simplicity in this v1, we loop.
        
        let passedCount = 0;

        for (const testCase of testCases) {
            const payload = {
                source_code: toBase64(code),
                language_id: languageId,
                stdin: toBase64(testCase.input),
                expected_output: toBase64(testCase.output),
                cpu_time_limit: timeLimit / 1000, // Judge0 uses seconds
                memory_limit: memoryLimit * 1024, // Judge0 uses KB
            };

            // 1. Send to Judge0
            const response = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, payload);
            const result = response.data;

            // 2. Analyze Result
            // Judge0 Status IDs: 3=Accepted, 4=WA, 5=Time Limit, 6=Compilation Error, etc.
            if (result.status.id !== 3) {
                allPassed = false;
                failedStatus = result.status.description;
                failureReason = result.compile_output ? fromBase64(result.compile_output) : result.status.description;
                break; // Stop at first failure
            }

            passedCount++;
            totalRuntime = Math.max(totalRuntime, parseFloat(result.time) * 1000);
            maxMemory = Math.max(maxMemory, result.memory);
        }

        // 3. Update Database
        const finalStatus = allPassed ? 'Accepted' : (failedStatus || 'Wrong Answer');
        
        await Submission.findByIdAndUpdate(submissionId, {
            status: finalStatus,
            runtime: totalRuntime,
            memory: maxMemory,
            passedTestCases: passedCount,
            totalTestCases: testCases.length,
            executionLogs: failureReason
        });

        console.log(`Submission ${submissionId} finished: ${finalStatus}`);

    } catch (err) {
        console.error(`Job failed: ${err.message}`);
        await Submission.findByIdAndUpdate(submissionId, {
            status: 'Runtime Error',
            executionLogs: 'Internal Server Error during execution'
        });
    }
}, { 
    connection: { host: REDIS_HOST, port: REDIS_PORT } 
});