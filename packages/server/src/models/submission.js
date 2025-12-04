import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    // FIXED: Changed 'Tvypes' to 'Types'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    code: { type: String, required: true },
    languageId: { type: Number, required: true }, 
    
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error'],
        default: 'Pending'
    },
    
    // Execution Metadata
    runtime: { type: Number, default: 0 }, 
    memory: { type: Number, default: 0 }, 
    executionLogs: { type: String }, 
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);