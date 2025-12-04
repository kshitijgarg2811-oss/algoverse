import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Code2, LogIn, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/Authcontext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                    <Code2 className="w-8 h-8" />
                    <span>AlgoVerse</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/contests" className="text-muted hover:text-white transition-colors">Contests</Link>
                    <Link to="/leaderboard" className="text-muted hover:text-white transition-colors">Leaderboard</Link>
                    <Link to="/discuss" className="text-muted hover:text-white transition-colors">Discuss</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                                    {user.username[0].toUpperCase()}
                                </div>
                                {user.username}
                            </span>
                            <button 
                                onClick={logout}
                                className="p-2 text-muted hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-white/5 border border-white/10 transition-all text-sm font-medium"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-lg bg-primary text-background font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;