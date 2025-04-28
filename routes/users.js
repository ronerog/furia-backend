const { uploadSingle } = require('../middlewares/upload');

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