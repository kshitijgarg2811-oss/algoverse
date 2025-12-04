import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    // Problems with specific point weighting for this contest
    problems: [{
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        points: { type: Number, default: 100 },
        order: { type: Number, default: 0 }
    }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { 
        type: String, 
        enum: ['Upcoming', 'Live', 'Ended', 'Archived'], 
        default: 'Upcoming' 
    },
}, { timestamps: true });

// Virtual for duration in minutes
contestSchema.virtual('duration').get(function() {
    return (this.endTime - this.startTime) / 1000 / 60;
});

export default mongoose.model('Contest', contestSchema);