import express from 'express';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET: Fetch ALL problems (with filtering)
router.get('/', async (req, res) => {
    try {
        const { difficulty, tags, search } = req.query;
        let query = {};

        if (difficulty && difficulty !== 'All') {
            query.difficulty = difficulty;
        }

        if (tags && tags !== 'All') {
            query.tags = { $in: [tags] }; // Find problems having this tag
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Fetch problems but exclude heavy fields like description/testCases for the list view
        const problems = await Problem.find(query).select('title slug difficulty tags acceptance frequency');
        res.json(problems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET: Fetch a single problem by ID
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        
        const { hiddenTestCases, ...problemData } = problem.toObject();
        res.json(problemData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST: Submit code
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { problemId, code, languageId } = req.body;
        const userId = req.user.id;
        const submissionQueue = req.app.get('submissionQueue');

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const submission = new Submission({
            userId,
            problemId,
            code,
            languageId,
            status: 'Pending'
        });
        await submission.save();

        await submissionQueue.add('execute', {
            submissionId: submission._id,
            code,
            languageId,
            problemId,
            testCases: problem.hiddenTestCases,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit
        });

        res.status(200).json({ 
            message: 'Submission queued', 
            submissionId: submission._id 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Submission failed' });
    }
});

export default router;