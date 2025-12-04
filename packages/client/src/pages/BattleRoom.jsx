import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/Authcontext';
import { Zap, ShieldAlert, Trophy } from 'lucide-react';

const BattleRoom = () => {
    const { id: roomId } = useParams(); // URL param
    const location = useLocation(); // Data passed from Lobby
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // Game State
    const [socket, setSocket] = useState(null);
    const [problem, setProblem] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [gameStatus, setGameStatus] = useState('waiting'); // waiting, active, ended
    const [winner, setWinner] = useState(null);
    const [effects, setEffects] = useState([]); // Active powerups (blur, etc)

    // Editor State
    const [code, setCode] = useState('// Waiting for battle to start...');
    const [language, setLanguage] = useState(63);

    // Initial Setup
    useEffect(() => {
        if (!location.state) {
            navigate('/battle'); // Redirect if accessed directly without state
            return;
        }

        const battleData = location.state;
        const oppUsername = Object.values(battleData.opponent).find(u => u.username !== user.username);
        setOpponent(oppUsername);

        // Fetch Problem
        const fetchProblem = async () => {
            const res = await axios.get(`http://localhost:5000/api/problems/${battleData.problemId}`);
            setProblem(res.data);
        };
        fetchProblem();

        // Connect Socket
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        newSocket.emit('joinBattleQueue', { username: user.username }); // Re-verify or just rely on room persistence if implementing reconnection
        
        // Listeners
        newSocket.on('battleStart', () => {
            setGameStatus('active');
            setCode('// GO! Write your solution here...');
        });

        newSocket.on('battleEnded', ({ winner: winnerId }) => {
            setGameStatus('ended');
            setWinner(winnerId === newSocket.id ? 'You' : 'Opponent');
        });

        newSocket.on('powerUpApplied', ({ type }) => {
            setEffects(prev => [...prev, type]);
            setTimeout(() => {
                setEffects(prev => prev.filter(e => e !== type));
            }, 5000); // Effect lasts 5s
        });

        return () => newSocket.close();
    }, []);

    const handleRun = async () => {
        if (gameStatus !== 'active') return;

        // 1. Submit to Judge0 (Mocked for Battle speed)
        // In real app: await axios.post('/api/problems/submit'...)
        
        // 2. If accepted, tell server
        // Simulating a win for demonstration:
        if (code.includes('return')) {
            socket.emit('battleWon', { roomId });
        }
    };

    const triggerPowerUp = (type) => {
        socket.emit('usePowerUp', { roomId, type });
    };

    return (
        <div className={`h-[calc(100vh-64px)] grid grid-cols-12 overflow-hidden ${effects.includes('blur') ? 'blur-sm' : ''}`}>
            
            {/* Left: Problem & Opponent Stats */}
            <div className="col-span-4 bg-background border-r border-white/5 flex flex-col">
                {/* Opponent Card */}
                <div className="p-4 bg-red-900/10 border-b border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Enemy</span>
                        <span className="text-xs text-muted">Rank #12</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center font-bold text-red-400">
                            {opponent?.username?.[0] || 'E'}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{opponent?.username || 'Unknown'}</h3>
                            <div className="text-xs text-muted">Status: Coding...</div>
                        </div>
                    </div>
                </div>

                {/* Problem Description */}
                <div className="flex-grow overflow-y-auto p-6">
                    {problem ? (
                        <>
                            <h1 className="text-2xl font-bold text-white mb-4">{problem.title}</h1>
                            <div className="prose prose-invert text-sm text-gray-400">
                                {problem.description}
                            </div>
                        </>
                    ) : (
                        <div className="animate-pulse h-4 bg-white/10 rounded w-3/4"></div>
                    )}
                </div>

                {/* Power-Up Bar */}
                <div className="p-4 border-t border-white/5 grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => triggerPowerUp('blur')}
                        className="p-3 bg-blue-500/10 border border-blue-500/20 rounded flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-colors"
                        title="Blur opponent's screen for 5s"
                    >
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-400">BLIND</span>
                    </button>
                    <button className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded flex items-center justify-center gap-2 cursor-not-allowed opacity-50">
                        <ShieldAlert className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">FREEZE</span>
                    </button>
                </div>
            </div>

            {/* Right: Code Editor */}
            <div className="col-span-8 relative">
                {gameStatus === 'waiting' && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-white mb-2">VS</h2>
                            <p className="text-primary animate-pulse">Waiting for battle to start...</p>
                        </div>
                    </div>
                )}

                {gameStatus === 'ended' && (
                    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
                        <div className="text-center space-y-6">
                            <Trophy className={`w-24 h-24 mx-auto ${winner === 'You' ? 'text-yellow-400' : 'text-gray-600'}`} />
                            <h2 className="text-5xl font-black text-white">{winner === 'You' ? 'VICTORY' : 'DEFEAT'}</h2>
                            <button onClick={() => navigate('/battle')} className="px-8 py-3 bg-white text-black font-bold rounded hover:scale-105 transition-transform">
                                Return to Lobby
                            </button>
                        </div>
                    </div>
                )}

                <CodeEditor 
                    code={code} 
                    setCode={setCode} 
                    language={language}
                    setLanguage={setLanguage}
                    onRun={handleRun}
                    isRunning={false}
                />
            </div>
        </div>
    );
};

export default BattleRoom;