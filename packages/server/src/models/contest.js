import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }], // Problems in this contest
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['Upcoming', 'Live', 'Ended'], default: 'Upcoming' },
}, { timestamps: true });

export default mongoose.model('Contest', contestSchema);