const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const rabbitmqService = require('./rabbitmq');

const userSocketMap = new Map();

 
async function initialize(server, jwtSecret) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });
  
  await rabbitmqService.connect();
  
  await rabbitmqService.consumeChatMessages((message) => {
    io.emit('new_message', message);
  });
  
  await rabbitmqService.consumeNotifications((notification) => {
    const userSockets = userSocketMap.get(notification.userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        io.to(socketId).emit('notification', notification);
      });
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`Usuário ${userId} conectado`);
    
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);
    
    const onlineUsers = userSocketMap.size;
    io.emit('user_count', onlineUsers);

    socket.on('send_message', async (data) => {
      try {
        const message = {
          id: Date.now().toString(),
          text: data.text,
          userId: userId,
          username: data.username || "Usuário",
          timestamp: new Date()
        };
        
        await rabbitmqService.publishChatMessage(message);
        
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        socket.emit('error', { message: 'Erro ao enviar mensagem' });
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`Usuário ${userId} desconectado`);
      
      if (userSocketMap.has(userId)) {
        userSocketMap.get(userId).delete(socket.id);
        if (userSocketMap.get(userId).size === 0) {
          userSocketMap.delete(userId);
        }
      }
      
      const onlineUsers = userSocketMap.size;
      io.emit('user_count', onlineUsers);
    });
  });
  
  return io;
}

module.exports = {
  initialize
};