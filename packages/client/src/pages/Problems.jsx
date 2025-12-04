import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    // Fetch problems from backend
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/problems');
                setProblems(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch problems:", err);
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Filter logic
    const filteredProblems = problems.filter(prob => 
        prob.title.toLowerCase().includes(filter.toLowerCase()) ||
        (prob.tags && prob.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())))
    );

    if (loading) return <div className="text-center mt-20 text-white">Loading library...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Problem Set</h1>
                    <p className="text-muted">Curated list of algorithm challenges to master.</p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search questions..."
                            className="w-full md:w-64 bg-surface border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                        <Filter className="w-5 h-5 text-muted" />
                    </button>
                </div>
            </div>

            {/* Tags / Filters Row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Arrays', 'DP', 'Graphs', 'Trees', 'Google', 'Amazon'].map(tag => (
                    <button key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-white/10 hover:border-primary/50 transition-colors whitespace-nowrap">
                        {tag}
                    </button>
                ))}
            </div>

            {/* Problems Table */}
            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-bold text-muted uppercase tracking-wider">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-2">Difficulty</div>
                    <div className="col-span-2">Acceptance</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredProblems.length === 0 ? (
                        <div className="p-8 text-center text-muted">No problems found. Did you run the seed script?</div>
                    ) : (
                        filteredProblems.map((prob) => (
                            <div key={prob._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                                <div className="col-span-1">
                                    <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-primary/50"></div>
                                </div>
                                <div className="col-span-5">
                                    <Link to={`/problem/${prob._id}`} className="font-medium text-white hover:text-primary transition-colors block">
                                        {prob.title}
                                    </Link>
                                    <div className="flex gap-2 mt-1">
                                        {prob.tags && prob.tags.map(t => <span key={t} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-muted">{t}</span>)}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded 
                                        ${prob.difficulty === 'Easy' ? 'text-green-400 bg-green-400/10' : 
                                          prob.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' : 
                                          'text-red-400 bg-red-400/10'}`}>
                                        {prob.difficulty}
                                    </span>
                                </div>
                                <div className="col-span-2 text-sm text-muted">
                                    {/* Defaulting acceptance if missing, as simple schema might not track it yet */}
                                    {prob.acceptance || 'N/A'}
                                </div>
                                <div className="col-span-2 text-right">
                                    <Link to={`/problem/${prob._id}`} className="text-primary text-sm font-bold hover:underline">
                                        Solve
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Problems;