module.exports = {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    frontendUrl: process.env.FRONTEND_URL,
    
    enableRateLimiting: true,
    enableHTTPS: true,
    enableCompression: true
  };