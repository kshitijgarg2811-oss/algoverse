import express from 'express';
import Comment from '../models/Comment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET: Fetch all comments for a problem
router.get('/:problemId', async (req, res) => {
    try {
        const comments = await Comment.find({ problemId: req.params.problemId })
            .populate('userId', 'username') // Fetch username
            .sort({ createdAt: -1 }); // Newest first
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST: Add a comment
router.post('/:problemId', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = new Comment({
            userId: req.user.id,
            problemId: req.params.problemId,
            content
        });
        await newComment.save();
        
        // Return populated comment
        await newComment.populate('userId', 'username');
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to post comment' });
    }
});

export default router;