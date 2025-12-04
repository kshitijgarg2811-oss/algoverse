import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemWorkspace from './pages/ProblemWorkspace';
import Problems from './pages/Problems';
import Leaderboard from './pages/Leaderboard';
import Contests from './pages/Contests';
// New Imports
import BattleLobby from './pages/BattleLobby';
import BattleRoom from './pages/BattleRoom';

function App() {
  return (
    <AuthProvider>
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problem/:id" element={<ProblemWorkspace />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/contests" element={<Contests />} />
            {/* Battle Routes */}
            <Route path="/battle" element={<BattleLobby />} />
            <Route path="/battle/:id" element={<BattleRoom />} />
            </Routes>
        </Layout>
        </Router>
    </AuthProvider>
  );
}

export default App;