import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/Authcontext';
import { Send, User } from 'lucide-react';

const DiscussionPanel = ({ problemId }) => {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/discussions/${problemId}`);
                setComments(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch comments", err);
                setLoading(false);
            }
        };
        if (problemId) fetchComments();
    }, [problemId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(`http://localhost:5000/api/discussions/${problemId}`, {
                content: newComment
            });
            setComments([res.data, ...comments]); // Add new comment to top
            setNewComment('');
        } catch (err) {
            alert('Failed to post comment');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] text-white">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-lg">Discussion</h3>
            </div>

            {/* Comments List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <p className="text-muted text-sm text-center">Loading discussions...</p>
                ) : comments.length === 0 ? (
                    <p className="text-muted text-sm text-center py-10">No comments yet. Be the first!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-surface rounded-lg p-3 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                                    {comment.userId?.username?.[0] || '?'}
                                </div>
                                <span className="text-xs font-bold text-gray-300">{comment.userId?.username || 'Unknown'}</span>
                                <span className="text-[10px] text-muted">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            {user ? (
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#1e1e1e]">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ask a question or share a tip..."
                            className="flex-grow bg-[#252526] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                        <button 
                            type="submit"
                            className="p-2 bg-primary rounded-lg text-black hover:opacity-90 transition-opacity"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-4 border-t border-white/5 text-center bg-[#1e1e1e]">
                    <p className="text-sm text-muted">Please login to comment.</p>
                </div>
            )}
        </div>
    );
};

export default DiscussionPanel;