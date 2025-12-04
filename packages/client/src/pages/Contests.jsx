import React from 'react';
import { Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';

const Contests = () => {
    return (
        <div className="space-y-12">
            <section className="relative rounded-2xl bg-gradient-to-r from-secondary to-primary p-1 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative bg-[#0a0a0f] rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            Live Now
                        </span>
                        <h1 className="text-4xl font-bold text-white">Weekly Contest #104</h1>
                        <p className="text-muted max-w-lg">
                            Battle it out in our weekly algorithm showdown. 4 problems, 90 minutes. 
                            Win exclusive badges and boost your rating!
                        </p>
                        <div className="flex gap-6 text-sm font-mono text-white pt-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>Ends in: 01:45:20</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                <span>Prize Pool: $500</span>
                            </div>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Enter Contest
                    </button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Upcoming Contests</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="bg-surface rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-xs font-mono text-muted">Dec {12 + i}, 2025</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Bi-Weekly Contest #{50 + i}</h3>
                            <p className="text-sm text-muted mb-4">Standard contest with 4 algorithmic problems.</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-xs font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded">Rated</span>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Contests;