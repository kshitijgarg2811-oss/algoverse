import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const connection = new IORedis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null
});

console.log(`Worker connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

// Database Connection (Optional for now, but good to have)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algoverse');
        console.log('Worker MongoDB Connected');
    } catch (err) {
        console.error('Worker MongoDB Connection Error:', err);
    }
};

connectDB();

// Example Worker
const worker = new Worker('submission-queue', async job => {
    console.log('Processing job:', job.id, job.name);
    // Job processing logic will go here
}, { connection });

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});

console.log('Worker started and listening for jobs...');
