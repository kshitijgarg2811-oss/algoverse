import React from 'react';
import { ArrowRight, Calendar, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10" />

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-7xl font-bold tracking-tight"
                >
                    Compete. <span className="text-primary">Code.</span> Conquer.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted max-w-2xl mx-auto"
                >
                    Join the ultimate college coding arena. Battle against peers in weekly challenges, climb the leaderboard, and prove your skills.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-4"
                >
                    <button className="px-8 py-4 rounded-xl bg-secondary text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                        Register for Contest <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 rounded-xl bg-surface border border-white/10 hover:bg-white/5 transition-colors font-medium text-lg">
                        Practice Problems
                    </button>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: 'Active Coders', value: '500+' },
                    { label: 'Contests Hosted', value: '50+' },
                    { label: 'Problems Solved', value: '200+' },
                    { label: 'Weekend', value: 'Every' },
                ].map((stat, index) => (
                    <div key={index} className="text-center p-6 rounded-2xl bg-surface/30 border border-white/5">
                        <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                        <p className="text-muted">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Upcoming Contests */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Upcoming Contests</h2>
                    <button className="text-primary hover:underline flex items-center gap-1">
                        View Leaderboard <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Mock Contest Card 1 */}
                    <div className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-colors group">
                        <div className="flex gap-2 mb-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">Upcoming</span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-muted">Medium</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">November Challenge Week 4</h3>
                        <p className="text-muted text-sm mb-6">Weekly coding contest featuring problems on Dynamic Programming, Graphs, and Binary Search.</p>

                        <div className="flex items-center gap-6 text-sm text-muted mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Thu, Dec 4, 2:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>4h</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>0 participants</span>
                            </div>
                        </div>

                        <button className="w-full py-3 rounded-lg bg-primary text-background font-bold hover:opacity-90 transition-opacity">
                            Register Now
                        </button>
                    </div>

                    {/* Mock Contest Card 2 */}
                    <div className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-colors group">
                        <div className="flex gap-2 mb-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">Upcoming</span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-muted">Easy</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Binary Search & Arrays Special</h3>
                        <p className="text-muted text-sm mb-6">Master binary search and array manipulation with this focused contest.</p>

                        <div className="flex items-center gap-6 text-sm text-muted mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Thu, Dec 11, 3:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>3h</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>0 participants</span>
                            </div>
                        </div>

                        <button className="w-full py-3 rounded-lg bg-surface border border-white/10 text-muted font-medium cursor-not-allowed">
                            Registered
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
