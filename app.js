const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  
  app.use(compression());
  
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Muitas requisições, tente novamente mais tarde'
    }
  });
  
  app.use(limiter);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./config/passport');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/streams', require('./routes/streams'));
app.use('/api/products', require('./routes/products'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => {
  res.send('API da FURIA está rodando');
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;