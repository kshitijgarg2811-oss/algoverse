import express from 'express';
import Submission from '../models/Submission.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Aggregate successful submissions to calculate score
        const leaderboard = await Submission.aggregate([
            { $match: { status: 'Accepted' } },
            // Group by User
            { 
                $group: { 
                    _id: "$userId", 
                    solvedCount: { $sum: 1 }, 
                    // In a real app, different problems have different points. 
                    // For now, 100 points per problem.
                    points: { $sum: 100 } 
                } 
            },
            { $sort: { points: -1 } }, // Sort by highest points
            { $limit: 10 } // Top 10
        ]);

        // Populate User Details (Username)
        // Aggregation results contain _id (userId), we need to fetch user info manually or via lookup
        const populatedLeaderboard = await User.populate(leaderboard, { path: "_id", select: "username" });

        // Format for frontend
        const formatted = populatedLeaderboard.map((entry, index) => ({
            rank: index + 1,
            username: entry._id.username,
            solved: entry.solvedCount,
            points: entry.points,
            country: 'IN' // Placeholder or add to User model
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;