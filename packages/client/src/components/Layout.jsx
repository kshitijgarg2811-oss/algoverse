import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-text flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t border-white/5 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-muted text-sm">
                    <p>&copy; {new Date().getFullYear()} AlgoVerse. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
