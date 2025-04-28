const Stream = require('../models/Stream');

exports.getStreams = async (req, res, next) => {
  try {
    const { game, isLive } = req.query;
    
    const query = {};
    
    if (game) {
      query.game = game;
    }
    
    if (isLive !== undefined) {
      query.isLive = isLive === 'true';
    }
    
    const streams = await Stream.find(query).sort({ 
      isLive: -1,
      viewerCount: -1,
      createdAt: -1 
    });
    
    res.json({
      success: true,
      count: streams.length,
      data: streams
    });
  } catch (err) {
    next(err);
  }
};

exports.getLiveStreams = async (req, res, next) => {
  try {
    const liveStreams = await Stream.find({ isLive: true })
      .sort({ viewerCount: -1 });
    
    res.json({
      success: true,
      count: liveStreams.length,
      data: liveStreams
    });
  } catch (err) {
    next(err);
  }
};

exports.getStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const stream = await Stream.findById(id);
    
    if (!stream) {
      return res.status(404).json({
        success: false,
        message: 'Stream não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: stream
    });
  } catch (err) {
    next(err);
  }
};