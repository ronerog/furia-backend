
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Recurso não encontrado'
      });
    }
  
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
  
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} já existente`
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
  
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        success: false,
        message: 'Erro no servidor'
      });
    }
  
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Erro no servidor',
      error: err
    });
  };
  
  module.exports = errorHandler;