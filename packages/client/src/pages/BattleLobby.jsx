import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Shield, Clock, Zap } from 'lucide-react';
import { AuthContext } from '../context/Authcontext';
import { io } from 'socket.io-client';

const BattleLobby = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, searching, found

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('matchFound', (data) => {
            setStatus('found');
            setTimeout(() => {
                navigate(`/battle/${data.roomId}`, { state: data });
            }, 1000);
        });

        return () => newSocket.close();
    }, [navigate]);

    const handleFindMatch = () => {
        if (!user) return alert("Login to fight!");
        setStatus('searching');
        socket.emit('joinBattleQueue', { username: user.username, id: user.id });
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#050505]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-2xl px-4">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        BATTLE ARENA
                    </h1>
                    <p className="text-xl text-gray-400">
                        1v1 Real-time Coding Duels. Prove your algorithm supremacy.
                    </p>
                </div>

                {/* Status Display */}
                <div className="h-32 flex items-center justify-center">
                    {status === 'idle' && (
                        <button 
                            onClick={handleFindMatch}
                            className="group relative px-8 py-4 bg-white text-black font-black text-xl rounded-none skew-x-[-12deg] hover:scale-105 transition-transform"
                        >
                            <span className="block skew-x-[12deg]">FIND MATCH</span>
                            <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform -z-10" />
                        </button>
                    )}

                    {status === 'searching' && (
                        <div className="space-y-4">
                            <div className="relative w-16 h-16 mx-auto">
                                <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-purple-400 font-mono animate-pulse">SEARCHING FOR OPPONENT...</p>
                        </div>
                    )}

                    {status === 'found' && (
                        <div className="text-green-400 font-bold text-2xl animate-bounce">
                            MATCH FOUND! ENTERING ARENA...
                        </div>
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <Swords className="w-8 h-8 text-red-400 mb-2" />
                        <h3 className="font-bold">1v1 Duels</h3>
                        <p className="text-xs text-gray-400">Compete against peers in synchronized coding environments.</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                        <h3 className="font-bold">Power Ups</h3>
                        <p className="text-xs text-gray-400">Use "Blind" or "Freeze" to disrupt your opponent.</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <Clock className="w-8 h-8 text-blue-400 mb-2" />
                        <h3 className="font-bold">Speed Matters</h3>
                        <p className="text-xs text-gray-400">Points awarded for both correctness and submission time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BattleLobby;