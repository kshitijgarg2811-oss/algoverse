import Problem from '../models/Problem.js';
import User from '../models/user.js';

// In-memory store for active battles (Use Redis in production for scaling)
const battles = new Map(); 
const queue = []; // Simple FIFO queue for matchmaking

export const setupBattleHandlers = (io, socket) => {
    
    // --- MATCHMAKING ---
    socket.on('joinBattleQueue', async (userData) => {
        // Prevent double queuing
        if (queue.find(p => p.socketId === socket.id)) return;

        console.log(`User ${userData.username} joined battle queue`);
        queue.push({ socketId: socket.id, user: userData });

        // Check if we have a pair
        if (queue.length >= 2) {
            const player1 = queue.shift();
            const player2 = queue.shift();
            
            await createBattle(io, player1, player2);
        }
    });

    socket.on('leaveBattleQueue', () => {
        const index = queue.findIndex(p => p.socketId === socket.id);
        if (index !== -1) queue.splice(index, 1);
    });

    // --- GAME EVENTS ---
    socket.on('submitBattleCode', async ({ roomId, code, languageId }) => {
        const battle = battles.get(roomId);
        if (!battle) return;

        // In a real app, you'd trigger the Judge0 worker here immediately.
        // For the UI demo, we simulate a "submission attempt" broadcasting to opponent
        socket.to(roomId).emit('opponentProgress', { status: 'Running Tests...' });
        
        // Simulating result for game flow (Replace with actual worker listener)
        // This relies on the client actually running the code via the standard API 
        // and reporting back, or the worker updating the socket.
    });

    socket.on('battleWon', ({ roomId }) => {
        const battle = battles.get(roomId);
        if (battle && battle.status === 'active') {
            battle.status = 'ended';
            battle.winner = socket.id;
            io.to(roomId).emit('battleEnded', { winner: socket.id });
            battles.delete(roomId); // Cleanup
        }
    });

    socket.on('usePowerUp', ({ roomId, type }) => {
        // Broadcast effect to opponent (e.g., 'blur', 'freeze')
        socket.to(roomId).emit('powerUpApplied', { type });
    });
};

// --- HELPER: Create Battle ---
const createBattle = async (io, p1, p2) => {
    const roomId = `battle_${Date.now()}`;
    const battle = {
        id: roomId,
        players: [p1, p2],
        status: 'starting',
        problem: null,
        startTime: null
    };

    // Fetch a random problem (simplified for now)
    const count = await Problem.countDocuments();
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne().skip(random);
    
    battle.problem = problem;

    // Join Socket Room
    const s1 = io.sockets.sockets.get(p1.socketId);
    const s2 = io.sockets.sockets.get(p2.socketId);
    
    if (s1 && s2) {
        s1.join(roomId);
        s2.join(roomId);
        
        battles.set(roomId, battle);

        // Notify Players
        io.to(roomId).emit('matchFound', {
            roomId,
            problemId: problem._id,
            opponent: {
                [p1.socketId]: p2.user,
                [p2.socketId]: p1.user
            }
        });

        // Start Countdown
        setTimeout(() => {
            battle.status = 'active';
            battle.startTime = Date.now();
            io.to(roomId).emit('battleStart');
        }, 5000); // 5s buffer before start
    }
};