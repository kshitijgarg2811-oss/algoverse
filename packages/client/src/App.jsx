import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemWorkspace from './pages/ProblemWorkspace';
import Problems from './pages/Problems'; // New
import Leaderboard from './pages/Leaderboard'; // New
import Contests from './pages/Contests'; // New

function App() {
  return (
    <AuthProvider>
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/problems" element={<Problems />} /> {/* Route added */}
            <Route path="/problem/:id" element={<ProblemWorkspace />} />
            <Route path="/leaderboard" element={<Leaderboard />} /> {/* Route added */}
            <Route path="/contests" element={<Contests />} /> {/* Route added */}
            </Routes>
        </Layout>
        </Router>
    </AuthProvider>
  );
}

export default App;