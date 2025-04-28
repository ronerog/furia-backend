const Match = require('../models/Match');


exports.getMatches = async (req, res, next) => {
  try {

    const { game, status } = req.query;
    
    const query = {};
    
    if (game) {
      query.game = game;
    }
    
    if (status) {
      query.status = status;
    }

    const matches = await Match.find(query).sort({ date: status === 'completed' ? -1 : 1 });
    
    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedMatches = async (req, res, next) => {
  try {
    const liveMatches = await Match.find({ status: 'live' });
    
    const upcomingMatches = await Match.find({ 
      status: 'upcoming',
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(3);
    
    const featuredMatches = [...liveMatches, ...upcomingMatches];
    
    res.json({
      success: true,
      count: featuredMatches.length,
      data: featuredMatches
    });
  } catch (err) {
    next(err);
  }
};

exports.getMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const match = await Match.findById(id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: match
    });
  } catch (err) {
    next(err);
  }
};