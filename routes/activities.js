const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const Activity = require('../models/Activity');

router.get('/', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado, requer privilégios de administrador'
      });
    }
    
    const activities = await Activity.find()
      .populate('user', 'username email')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    next(err);
  }
});


router.get('/type/:type', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado, requer privilégios de administrador'
      });
    }
    
    const { type } = req.params;
    
    const activities = await Activity.find({ type })
      .populate('user', 'username email')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;