import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Queue, QueueEvents } from 'bullmq'; 
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problem.js'; 
import discussionRoutes from './routes/discussions.js'; 
import aiRoutes from './routes/ai.js'; // <--- IMPORT THIS
import Submission from './models/Submission.js'; 
import { setupBattleHandlers } from './sockets/battleHandler.js'; // <--- IMPORT

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algoverse');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

// Redis Connection Config
const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
};

// Queue Setup (For adding jobs)
const submissionQueue = new Queue('submission-queue', {
    connection: redisConnection
});

const queueEvents = new QueueEvents('submission-queue', {
    connection: redisConnection
});

// --- Real-Time Execution Listener ---
queueEvents.on('completed', async ({ jobId }) => {
    const job = await submissionQueue.getJob(jobId);
    if (job && job.data.submissionId) {
        const submissionId = job.data.submissionId;
        console.log(`Job ${jobId} finished for submission ${submissionId}`);
        const submission = await Submission.findById(submissionId);
        io.to(submissionId).emit('submissionResult', submission);
    }
});

app.set('submissionQueue', submissionQueue);

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes); 
app.use('/api/discussions', discussionRoutes);
app.use('/api/ai', aiRoutes); // <--- REGISTER ROUTE

app.get('/', (req, res) => {
    res.send('AlgoVerse API is running');
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('joinSubmission', (submissionId) => {
        socket.join(submissionId);
    });
    // --- REGISTER BATTLE HANDLERS ---
    setupBattleHandlers(io, socket);
    // --------------------------------

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Note: BattleHandler handles queue cleanup internally if logic added there
    });
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();