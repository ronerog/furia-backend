const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  tournamentName: {
    type: String,
    required: [true, 'Nome do torneio é obrigatório'],
    trim: true
  },
  tournamentLogo: {
    type: String,
    required: [true, 'Logo do torneio é obrigatório']
  },
  date: {
    type: Date,
    required: [true, 'Data é obrigatória']
  },
  game: {
    type: String,
    required: [true, 'Jogo é obrigatório'],
    enum: ['valorant', 'csgo', 'lol', 'apex']
  },
  opponentName: {
    type: String,
    required: [true, 'Nome do oponente é obrigatório'],
    trim: true
  },
  opponentLogo: {
    type: String,
    required: [true, 'Logo do oponente é obrigatório']
  },
  furiaScore: {
    type: Number
  },
  opponentScore: {
    type: Number
  },
  streamUrl: {
    type: String
  },
  highlightsUrl: {
    type: String
  },
  status: {
    type: String,
    required: [true, 'Status é obrigatório'],
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', MatchSchema);