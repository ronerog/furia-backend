const Player = require('../models/Player');

exports.getPlayers = async (req, res, next) => {
  try {
    const { game, active } = req.query;
    
    const query = {};
    
    if (game) {
      query.game = game;
    }
    
    if (active !== undefined) {
      query.active = active === 'true';
    }
    
    const players = await Player.find(query);
    
    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (err) {
    next(err);
  }
};

exports.getPlayer = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const player = await Player.findById(id);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Jogador não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: player
    });
  } catch (err) {
    next(err);
  }
};