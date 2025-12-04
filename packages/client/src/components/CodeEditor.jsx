import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';

const CodeEditor = ({ code, setCode, language, setLanguage, onRun, isRunning }) => {
    // Default boilerplate for supported languages
    const boilerplates = {
        63: `// JavaScript (Node.js)
console.log("Hello, AlgoVerse!");`,
        71: `# Python 3
print("Hello, AlgoVerse!")`,
        54: `// C++ (GCC 9.2.0)
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, AlgoVerse!" << endl;
    return 0;
}`
    };

    const handleLanguageChange = (e) => {
        const langId = parseInt(e.target.value);
        setLanguage(langId);
        setCode(boilerplates[langId]);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-3">
                    <select 
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-[#333333] text-sm text-white px-3 py-1.5 rounded-md border border-white/10 focus:outline-none focus:border-primary"
                    >
                        <option value={63}>JavaScript (Node.js)</option>
                        <option value={71}>Python 3</option>
                        <option value={54}>C++</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCode(boilerplates[language])}
                        className="p-2 text-muted hover:text-white transition-colors"
                        title="Reset Code"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={onRun}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition-all
                            ${isRunning 
                                ? 'bg-white/10 text-muted cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20'
                            }`}
                    >
                        <Play className="w-4 h-4 fill-current" />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="grow relative">
                <Editor
                    height="100%"
                    language={language === 63 ? 'javascript' : language === 71 ? 'python' : 'cpp'}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        padding: { top: 16 },
                        fontFamily: "'Fira Code', monospace",
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;