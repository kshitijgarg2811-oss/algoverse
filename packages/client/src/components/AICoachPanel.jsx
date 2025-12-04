import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, AlertTriangle, Zap } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AICoachPanel = ({ code, problem }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm AlgoBot. I can help you optimize your code, debug errors, or give you a gentle nudge in the right direction. What's on your mind?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (text, type = 'general') => {
        if (!text) return;

        const newUserMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/ai/chat', {
                message: text,
                code: code, // Pass current editor code
                problemContext: {
                    title: problem.title,
                    description: problem.description
                },
                contextType: type
            });

            const newAiMsg = { role: 'ai', content: res.data.reply };
            setMessages(prev => [...prev, newAiMsg]);
        } catch (err) {
            const errorMsg = { role: 'ai', content: "I'm having trouble connecting to the neural network. Please check your connection." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        if (action === 'complexity') sendMessage("What is the time and space complexity of my solution?", 'complexity');
        if (action === 'hint') sendMessage("Can you give me a small hint without solving it?", 'hint');
        if (action === 'debug') sendMessage("I think there's a bug. Can you help me spot it?", 'debug');
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] text-white">
            {/* Header with Quick Actions */}
            <div className="p-4 border-b border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                    <Bot className="w-5 h-5" />
                    <h3 className="font-bold text-lg">AI Code Coach</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button onClick={() => handleQuickAction('complexity')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-white/10 hover:border-primary/50 text-xs font-medium whitespace-nowrap transition-colors">
                        <Zap className="w-3 h-3 text-yellow-400" /> Complexity
                    </button>
                    <button onClick={() => handleQuickAction('hint')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-white/10 hover:border-primary/50 text-xs font-medium whitespace-nowrap transition-colors">
                        <Sparkles className="w-3 h-3 text-purple-400" /> Hint
                    </button>
                    <button onClick={() => handleQuickAction('debug')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-white/10 hover:border-primary/50 text-xs font-medium whitespace-nowrap transition-colors">
                        <AlertTriangle className="w-3 h-3 text-red-400" /> Debug
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                            msg.role === 'user' 
                                ? 'bg-primary text-black font-medium rounded-tr-none' 
                                : 'bg-surface border border-white/10 text-gray-300 rounded-tl-none'
                        }`}>
                            {/* Simple Markdown Rendering (Replace with react-markdown for robust rendering) */}
                            {msg.content.split('\n').map((line, idx) => (
                                <p key={idx} className="min-h-[1rem]">{line}</p>
                            ))}
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-surface border border-white/10 rounded-2xl rounded-tl-none p-3 flex gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-4 border-t border-white/5 bg-[#1e1e1e]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask AlgoBot..."
                        className="flex-grow bg-[#252526] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                    />
                    <button 
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-2.5 bg-primary rounded-lg text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AICoachPanel;