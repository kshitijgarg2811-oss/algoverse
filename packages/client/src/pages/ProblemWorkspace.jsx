import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import DiscussionPanel from '../components/DiscussionPanel'; // Import Discussion Panel
import { AuthContext } from '../context/Authcontext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';

const ProblemWorkspace = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description'); // New State for Tabs
    const [socket, setSocket] = useState(null);
    
    // Editor State
    const [language, setLanguage] = useState(63); 
    const [code, setCode] = useState(`// Write your solution here...`);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Connect to Socket.io
    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    // Fetch Problem Data
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
                setProblem(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch problem", err);
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const handleRun = async () => {
        if (!user) {
            alert("Please login to submit code!");
            return;
        }
        setIsRunning(true);
        setOutput(null);
        
        try {
            const res = await axios.post('http://localhost:5000/api/problems/submit', {
                problemId: id,
                languageId: language,
                code: code
            });
            
            const submissionId = res.data.submissionId;
            setOutput({ status: 'Queued', message: 'Waiting for execution...' });

            if (socket) {
                socket.emit('joinSubmission', submissionId);
                
                socket.once('submissionResult', (result) => {
                    setOutput({ 
                        status: result.status, 
                        message: result.status === 'Accepted' 
                            ? `Runtime: ${result.runtime}ms | Memory: ${result.memory}KB` 
                            : result.executionLogs || 'Test cases failed'
                    });
                    setIsRunning(false);
                });
            }

        } catch (error) {
            setOutput({ status: 'Error', message: 'Failed to submit code.' });
            setIsRunning(false);
        }
    };

    if (loading) return <div className="text-center mt-20 text-white">Loading problem...</div>;
    if (!problem) return <div className="text-center mt-20 text-red-400">Problem not found</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-64px)]">
            {/* Left Panel: Tabs + Content */}
            <div className="bg-background border-r border-white/5 flex flex-col h-full overflow-hidden">
                {/* Tabs Header */}
                <div className="flex border-b border-white/5 bg-surface/50">
                    <button 
                        onClick={() => setActiveTab('description')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'description' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-muted hover:text-white'}`}
                    >
                        Description
                    </button>
                    <button 
                        onClick={() => setActiveTab('discussion')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'discussion' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-muted hover:text-white'}`}
                    >
                        Discussion
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-grow overflow-y-auto">
                    {activeTab === 'description' ? (
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-white">{problem.title}</h1>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium 
                                        ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : 
                                          problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                                          'bg-red-500/10 text-red-400'}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none text-muted">
                                <p>{problem.description}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-white">Examples</h3>
                                {problem.exampleTestCases && problem.exampleTestCases.map((ex, i) => (
                                    <div key={i} className="bg-surface rounded-lg p-4 space-y-2 border border-white/5">
                                        <div>
                                            <span className="text-xs text-muted uppercase font-bold tracking-wider">Input:</span>
                                            <code className="block mt-1 text-sm bg-black/30 p-2 rounded text-white">{ex.input}</code>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted uppercase font-bold tracking-wider">Output:</span>
                                            <code className="block mt-1 text-sm bg-black/30 p-2 rounded text-white">{ex.output}</code>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Output Console */}
                            {output && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-lg border border-white/10
                                        ${output.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                          output.status === 'Queued' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                          'bg-red-500/10 text-red-400 border-red-500/20'}`}
                                >
                                    <h4 className="font-bold text-sm mb-1 text-white">{output.status}</h4>
                                    <pre className="text-xs font-mono text-muted">{output.message}</pre>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <DiscussionPanel problemId={id} />
                    )}
                </div>
            </div>

            {/* Right Panel: Code Editor */}
            <div className="h-full bg-[#1e1e1e]">
                <CodeEditor 
                    code={code} 
                    setCode={setCode} 
                    language={language}
                    setLanguage={setLanguage}
                    onRun={handleRun}
                    isRunning={isRunning}
                />
            </div>
        </div>
    );
};

export default ProblemWorkspace;