import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
    const users = [
        { rank: 1, username: "AlgoKing", solved: 450, points: 15200, country: "IN" },
        { rank: 2, username: "CodeNinja", solved: 423, points: 14800, country: "US" },
        { rank: 3, username: "ByteMaster", solved: 390, points: 13500, country: "DE" },
        { rank: 4, username: "SystemDes", solved: 310, points: 11000, country: "IN" },
        { rank: 5, username: "ReactPro", solved: 280, points: 9800, country: "CA" },
    ];

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
        return <span className="font-bold text-muted">#{rank}</span>;
    };

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
                    {users.map((user, i) => (
                        <div key={i} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${user.rank <= 3 ? 'bg-primary/5' : ''}`}>
                            <div className="col-span-2 flex justify-center">
                                {getRankIcon(user.rank)}
                            </div>
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center font-bold text-xs">
                                    {user.username[0]}
                                </div>
                                <span className={user.rank <= 3 ? "font-bold text-white" : "text-muted"}>
                                    {user.username}
                                </span>
                            </div>
                            <div className="col-span-3 text-right font-mono text-primary">
                                {user.solved}
                            </div>
                            <div className="col-span-2 text-right font-mono text-white">
                                {user.points.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;