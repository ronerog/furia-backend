const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const Activity = require('../models/Activity');

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
  
  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`Usuário ${userId} conectado`);
    
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);
    
    const onlineUsers = userSocketMap.size;
    io.emit('user_count', onlineUsers);

    try {
      const recentMessages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('user', 'username');
        
      const formattedMessages = recentMessages.reverse().map(msg => ({
        id: msg._id,
        text: msg.text,
        userId: msg.user._id,
        username: msg.user.username,
        timestamp: msg.createdAt
      }));
      
      socket.emit('recent_messages', formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens recentes:', error);
    }

    socket.on('send_message', async (data) => {
      try {
        if (!data.text || data.text.trim() === '') {
          return;
        }
        
        const user = await User.findById(userId);
        if (!user) {
          return socket.emit('error', { message: 'Usuário não encontrado' });
        }
        
        const text = data.text.trim().substring(0, 500);
        
        const message = new Message({
          text,
          user: userId
        });
        
        await message.save();
        
        user.points += 1;
        await User.findByIdAndUpdate(userId, { points: user.points });
        
        const activity = new Activity({
          user: userId,
          type: 'chat_message',
          points: 1,
          timestamp: new Date()
        });
        
        await activity.save();
        
        io.emit('new_message', {
          id: message._id,
          text: message.text,
          userId: userId,
          username: data.username || "Usuário",
          timestamp: message.createdAt
        });
        
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        socket.emit('error', { message: 'Erro ao enviar mensagem' });
      }
    });
    
    socket.on('typing', () => {
      socket.broadcast.emit('user_typing', {
        username: data.username || "Usuário"
      });
    });
    
    socket.on('stop_typing', () => {
      socket.broadcast.emit('user_stop_typing', {
        username: data.username || "Usuário"
      });
    });
    
    socket.on('notification', (notificationData) => {
      const targetUserId = notificationData.userId;
      
      if (targetUserId) {
        const userSockets = userSocketMap.get(targetUserId);
        if (userSockets) {
          userSockets.forEach(socketId => {
            io.to(socketId).emit('notification', notificationData);
          });
        }
      } else {
        io.emit('notification', notificationData);
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