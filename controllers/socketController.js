const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

function socketControlller(io) {
  const connectedUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Autenticação necessária'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Usuário não encontrado'));
      }
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`Usuário conectado: ${socket.user.username}`);
    
    connectedUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      username: socket.user.username,
      userId: socket.user._id
    });
    
    io.emit('user_count', connectedUsers.size);
    
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
    } catch (err) {
      console.error('Erro ao buscar mensagens recentes:', err);
    }
    
    socket.on('send_message', async (data) => {
      try {
        if (!data.text || data.text.trim() === '') {
          return;
        }
        
        const text = data.text.trim().substring(0, 500);
        
        const message = new Message({
          text,
          user: socket.user._id
        });
        
        await message.save();
        
        socket.user.points += 1;
        await User.findByIdAndUpdate(socket.user._id, { points: socket.user.points });
        
        const Activity = require('../models/Activity');
        const activity = new Activity({
          user: socket.user._id,
          type: 'chat_message',
          points: 1,
          timestamp: new Date()
        });
        
        await activity.save();
        
        io.emit('new_message', {
          id: message._id,
          text: message.text,
          userId: socket.user._id,
          username: socket.user.username,
          timestamp: message.createdAt
        });
      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
      }
    });
    
    socket.on('typing', () => {
      socket.broadcast.emit('user_typing', {
        username: socket.user.username
      });
    });
    
    socket.on('stop_typing', () => {
      socket.broadcast.emit('user_stop_typing', {
        username: socket.user.username
      });
    });
    
    socket.on('disconnect', () => {
      console.log(`Usuário desconectado: ${socket.user.username}`);
      
      connectedUsers.delete(socket.user._id.toString());
      
      io.emit('user_count', connectedUsers.size);
    });
  });
};

module.exports = socketControlller;