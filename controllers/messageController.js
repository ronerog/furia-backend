const Message = require('../models/Message');

exports.getMessages = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('user', 'username');
    
    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      text: msg.text,
      userId: msg.user._id,
      username: msg.user.username,
      timestamp: msg.createdAt
    }));
    
    res.json({
      success: true,
      count: formattedMessages.length,
      data: formattedMessages
    });
  } catch (err) {
    next(err);
  }
};