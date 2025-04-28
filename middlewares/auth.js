const passport = require('passport');

exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado, token inválido ou expirado'
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acesso negado, requer privilégios de administrador'
    });
  }
};