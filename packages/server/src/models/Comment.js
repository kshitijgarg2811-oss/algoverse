import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested replies
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who upvoted
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);