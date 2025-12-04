import express from 'express';
import Contest from '../models/contest.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET: Fetch all contests
router.get('/', async (req, res) => {
    try {
        const contests = await Contest.find().sort({ startTime: 1 });
        res.json(contests);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST: Create a new contest (Admin only)
router.post('/', [verifyToken, verifyAdmin], async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;
        const contest = new Contest({
            title,
            description,
            startTime,
            endTime,
            problems
        });
        await contest.save();
        res.status(201).json(contest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Register for a contest
router.post('/:id/register', verifyToken, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        if (contest.participants.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        contest.participants.push(req.user.id);
        await contest.save();
        res.json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;