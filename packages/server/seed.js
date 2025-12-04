import mongoose from 'mongoose';
import Problem from './src/models/problem.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algoverse');
    
    // Clear existing problems
    await Problem.deleteMany({});

    // Create "Two Sum"
    const problem = new Problem({
        title: "Two Sum",
        slug: "two-sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        hiddenTestCases: [
            { input: "2\n7\n11\n15\n9", output: "0 1" } // Simple example input
        ]
    });

    await problem.save();
    console.log("Database seeded with 'Two Sum'");
    console.log("Problem ID:", problem._id); // COPY THIS ID!
    process.exit();
};

seed();