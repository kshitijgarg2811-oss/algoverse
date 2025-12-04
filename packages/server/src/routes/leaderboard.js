import express from 'express';
import Submission from '../models/Submission.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const leaderboard = await Submission.aggregate([
            { $match: { status: 'Accepted' } },
            { 
                $group: { 
                    _id: "$userId", 
                    solvedCount: { $sum: 1 }, 
                    points: { $sum: 100 } 
                } 
            },
            { $sort: { points: -1 } }, 
            { $limit: 10 } 
        ]);

        const populatedLeaderboard = await User.populate(leaderboard, { path: "_id", select: "username" });

        const formatted = populatedLeaderboard.map((entry, index) => ({
            rank: index + 1,
            username: entry._id.username,
            solved: entry.solvedCount,
            points: entry.points,
            country: 'IN' 
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Leaderboard Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;