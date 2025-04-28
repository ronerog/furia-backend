const Game = require('../models/Game');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Stream = require('../models/Stream');
const Product = require('../models/Product');

exports.getGames = async (req, res, next) => {
  try {
    const games = await Game.find();
    
    res.json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (err) {
    next(err);
  }
};

exports.getGame = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const game = await Game.findOne({ slug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }
    
    const players = await Player.find({ 
      game: slug,
      active: true 
    });
    
    const upcomingMatches = await Match.find({ 
      game: slug,
      status: { $in: ['upcoming', 'live'] },
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    
    const previousMatches = await Match.find({ 
      game: slug,
      status: 'completed',
      date: { $lt: new Date() }
    }).sort({ date: -1 }).limit(5);
    
    const liveStreams = await Stream.find({ 
      game: slug,
      isLive: true
    });
    
    const streamerContent = await Stream.find({ 
      game: slug,
      isLive: false
    }).sort({ createdAt: -1 }).limit(8);
    
    const products = await Product.find({ 
      game: slug,
      inStock: true
    });
    
    const gameData = {
      ...game._doc,
      players,
      upcomingMatches,
      previousMatches,
      liveStreams,
      streamerContent,
      products
    };
    
    res.json({
      success: true,
      data: gameData
    });
  } catch (err) {
    next(err);
  }
};