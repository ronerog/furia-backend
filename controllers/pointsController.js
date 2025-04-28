const User = require('../models/User');
const Activity = require('../models/Activity');
const Reward = require('../models/Reward');

exports.addPoints = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amount, activityType } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }


    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a adicionar pontos para outro usuário'
      });
    }


    const activity = new Activity({
      user: userId,
      type: activityType,
      points: amount,
      timestamp: new Date()
    });

    await activity.save();


    user.points += amount;
    await user.save();

    res.json({
      success: true,
      totalPoints: user.points,
      addedPoints: amount,
      activity: activity
    });
  } catch (err) {
    next(err);
  }
};


exports.getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({ active: true }).sort({ pointsCost: 1 });
    
    res.json({
      success: true,
      count: rewards.length,
      data: rewards
    });
  } catch (err) {
    next(err);
  }
};

exports.redeemReward = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { rewardId, shippingAddress } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a resgatar recompensas para outro usuário'
      });
    }

    const reward = await Reward.findById(rewardId);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Recompensa não encontrada'
      });
    }

    if (!reward.active) {
      return res.status(400).json({
        success: false,
        message: 'Esta recompensa não está mais disponível'
      });
    }

    if (reward.stock === 0) {
      return res.status(400).json({
        success: false,
        message: 'Esta recompensa está esgotada'
      });
    }

    if (user.points < reward.pointsCost) {
      return res.status(400).json({
        success: false,
        message: 'Pontos insuficientes para resgatar esta recompensa'
      });
    }

    const activity = new Activity({
      user: userId,
      type: 'reward_redemption',
      points: -reward.pointsCost,
      rewardId: rewardId,
      rewardName: reward.name,
      timestamp: new Date()
    });

    await activity.save();
s
    user.points -= reward.pointsCost;
    await user.save();

    if (reward.stock > 0) {
      reward.stock -= 1;
      await reward.save();
    }

    res.json({
      success: true,
      message: 'Recompensa resgatada com sucesso',
      rewardName: reward.name,
      pointsCost: reward.pointsCost,
      remainingPoints: user.points,
      redemptionId: activity._id
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserActivities = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a ver atividades de outro usuário'
      });
    }

    const activities = await Activity.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a ver estatísticas de outro usuário'
      });
    }

    const chatMessages = await Activity.countDocuments({ 
      user: userId, 
      type: 'chat_message' 
    });
    
    const matchesWatched = await Activity.countDocuments({ 
      user: userId, 
      type: 'watch_match' 
    });
    
    const highlightsWatched = await Activity.countDocuments({ 
      user: userId, 
      type: 'watch_highlights' 
    });
    
    const rewardsRedeemed = await Activity.countDocuments({ 
      user: userId, 
      type: 'reward_redemption' 
    });

    const viewTimeActivities = await Activity.find({ 
      user: userId, 
      type: 'view_time' 
    });
    
    const totalTimeMinutes = viewTimeActivities.reduce((total, activity) => {
      return total + (activity.points / 5) * 5;
    }, 0);

    res.json({
      success: true,
      data: {
        totalTimeMinutes,
        messagesCount: chatMessages,
        matchesWatched,
        highlightsWatched,
        rewardsRedeemed,
        favoriteGame: user.favoriteGame,
        joinDate: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};