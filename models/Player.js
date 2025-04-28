const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Nickname é obrigatório'],
    trim: true
  },
  realName: {
    type: String,
    required: [true, 'Nome real é obrigatório'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Função é obrigatória'],
    trim: true
  },
  photoUrl: {
    type: String,
    required: [true, 'URL da foto é obrigatória']
  },
  game: {
    type: String,
    required: [true, 'Jogo é obrigatório'],
    enum: ['valorant', 'csgo', 'lol', 'apex']
  },
  twitterUrl: {
    type: String
  },
  twitchUrl: {
    type: String
  },
  instagramUrl: {
    type: String
  },
  description: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', PlayerSchema);