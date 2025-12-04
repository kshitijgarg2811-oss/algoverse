import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
});

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true }, 
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: [{ type: String, index: true }],
    
    frequency: { type: Number, default: 0 },
    companies: [{ type: String }], // FIXED: Changed 'companiesyb' to 'companies'
    
    // Test Cases
    exampleTestCases: [testCaseSchema], 
    hiddenTestCases: [testCaseSchema],  
    
    // Constraints
    timeLimit: { type: Number, default: 1000 }, 
    memoryLimit: { type: Number, default: 128 }, 
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);