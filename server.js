const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: true,  // 启用连接恢复
  pingTimeout: 30000,            // 超时时间调整为 30s
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' : '*'
  }
});

// 身份验证中间件（按需启用）
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token === 'YOUR_SECRET_KEY') {  // 实际替换为验证逻辑
    next();
  } else {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] Client connected: ${socket.id}`);

  socket.on('message', (data) => {
    io.emit('response', { 
      timestamp: Date.now(),
      data: `Received: ${data}`
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '127.0.0.1', () => {  // 限定本地访问
  console.log(`WS server running at http://localhost:${PORT}`);
});