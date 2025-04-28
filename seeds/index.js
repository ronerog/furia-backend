const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Game = require('../models/Game');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Stream = require('../models/Stream');
const Product = require('../models/Product');
const Reward = require('../models/Reward');

dotenv.config();

const gameSeeds = require('./gameSeeds');
const playerSeeds = require('./playerSeeds');
const matchSeeds = require('./matchSeeds');
const streamSeeds = require('./streamSeeds');
const productSeeds = require('./productSeeds');
const rewardSeeds = require('./rewardSeeds');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado para seeds'))
  .catch(err => {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    await Game.deleteMany();
    await Player.deleteMany();
    await Match.deleteMany();
    await Stream.deleteMany();
    await Product.deleteMany();
    await Reward.deleteMany();
    
    console.log('Coleções limpas');

    await Game.insertMany(gameSeeds);
    console.log('Jogos adicionados');

    await Player.insertMany(playerSeeds);
    console.log('Jogadores adicionados');

    await Match.insertMany(matchSeeds);
    console.log('Partidas adicionadas');

    await Stream.insertMany(streamSeeds);
    console.log('Streams adicionadas');

    await Product.insertMany(productSeeds);
    console.log('Produtos adicionados');

    await Reward.insertMany(rewardSeeds);
    console.log('Recompensas adicionadas');

    console.log('Banco de dados populado com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    process.exit(1);
  }
};

seedDatabase();