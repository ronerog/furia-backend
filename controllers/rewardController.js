const Reward = require('../models/Reward');

exports.getRewards = async (req, res, next) => {
  try {
    const { active } = req.query;
    
    const query = {};
    
    if (active !== undefined) {
      query.active = active === 'true';
    }
    
    const rewards = await Reward.find(query).sort({ pointsCost: 1 });
    
    res.json({
      success: true,
      count: rewards.length,
      data: rewards
    });
  } catch (err) {
    next(err);
  }
};

exports.getReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const reward = await Reward.findById(id);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Recompensa não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: reward
    });
  } catch (err) {
    next(err);
  }
};