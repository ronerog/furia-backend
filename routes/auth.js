const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post(
  '/register',
  [
    check('username', 'Nome de usuário é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Por favor, insira uma senha com 6 ou mais caracteres').isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Senha é obrigatória').exists()
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;