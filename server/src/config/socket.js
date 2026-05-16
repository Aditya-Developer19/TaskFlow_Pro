const { Server } = require('socket.io');
const { verifyAccessToken } = require('../services/token.service');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true },
  });

  // Auth handshake — client must send token in socket handshake auth
  io.use((socket, next) => {
    try {
      const token   = socket.handshake.auth.token;
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.userId);

    // Join a project room
    socket.on('join:project', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.userId} joined project room: ${projectId}`);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(projectId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.userId);
    });
  });
};

const getIO = () => io;

module.exports = initSocket;
module.exports.getIO = getIO;
