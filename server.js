
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const socketController = require('./controllers/socketController');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');



dotenv.config();

const app = express();

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar com MongoDB', err));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

require('./config/passport');

// // Rotas
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/games', require('./routes/games'));
// app.use('/api/players', require('./routes/players'));
// app.use('/api/matches', require('./routes/matches'));
// app.use('/api/streams', require('./routes/streams'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/rewards', require('./routes/rewards'));
// app.use('/api/activities', require('./routes/activities'));
// app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => {
  res.send('API da FURIA está rodando');
});

app.use(errorHandler);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

socketController(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));