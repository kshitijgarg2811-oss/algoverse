import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import axios from 'axios';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/leaderboard');
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
        return <span className="font-bold text-muted text-lg">#{rank}</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Global Leaderboard</h1>
                <p className="text-muted">Top performers this week. Keep solving to climb the ranks!</p>
            </div>

            <div className="bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-[#252526] border-b border-white/5 font-bold text-sm text-muted uppercase">
                    <div className="col-span-2 text-center">Rank</div>
                    <div className="col-span-5">User</div>
                    <div className="col-span-3 text-right">Problems Solved</div>
                    <div className="col-span-2 text-right">Points</div>
                </div>

                <div className="divide-y divide-white/5">
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-muted">
                            No submissions yet. Be the first to solve a problem!
                        </div>
                    ) : (
                        users.map((user, i) => (
                            <div key={i} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${user.rank <= 3 ? 'bg-primary/5' : ''}`}>
                                <div className="col-span-2 flex justify-center">
                                    {getRankIcon(user.rank)}
                                </div>
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center font-bold text-sm text-white">
                                        {user.username?.[0].toUpperCase()}
                                    </div>
                                    <span className={user.rank <= 3 ? "font-bold text-white text-lg" : "text-gray-300"}>
                                        {user.username}
                                    </span>
                                </div>
                                <div className="col-span-3 text-right font-mono text-primary text-lg">
                                    {user.solved}
                                </div>
                                <div className="col-span-2 text-right font-mono text-white text-lg">
                                    {user.points.toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;