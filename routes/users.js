const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');
const User = require('../models/User');
const { addPoints, getUserActivities, getUserStats, redeemReward, getRewards } = require('../controllers/pointsController');

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:userId', protect, async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar outro usuário'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    const {
      fullName,
      birthDate,
      city,
      state,
      country,
      favoriteGame,
      howDidYouFind,
      instagramHandle,
      twitterHandle,
      twitchHandle,
      favoritePlayer
    } = req.body;
    
    if (fullName) user.fullName = fullName;
    if (birthDate) user.birthDate = birthDate;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;
    if (favoriteGame) user.favoriteGame = favoriteGame;
    if (howDidYouFind) user.howDidYouFind = howDidYouFind;
    if (instagramHandle) user.instagramHandle = instagramHandle;
    if (twitterHandle) user.twitterHandle = twitterHandle;
    if (twitchHandle) user.twitchHandle = twitchHandle;
    if (favoritePlayer) user.favoritePlayer = favoritePlayer;
    
    await user.save();
    
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:userId/profile-image',
  protect,
  uploadSingle('profileImage', 'profile'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      
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
          message: 'Não autorizado a atualizar outro usuário'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhuma imagem enviada'
        });
      }
      
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
      await user.save();
      
      res.json({
        success: true,
        data: {
          profileImage: user.profileImage
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/:userId/points', protect, addPoints);
router.get('/:userId/activities', protect, getUserActivities);
router.get('/:userId/stats', protect, getUserStats);
router.post('/:userId/redeem', protect, redeemReward);

module.exports = router;