const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do jogo é obrigatório'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug é obrigatório'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  heroImage: {
    type: String,
    required: [true, 'Imagem de destaque é obrigatória']
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', GameSchema);