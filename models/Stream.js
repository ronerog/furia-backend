const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  streamerName: {
    type: String,
    required: [true, 'Nome do streamer é obrigatório'],
    trim: true
  },
  streamerAvatar: {
    type: String,
    required: [true, 'Avatar do streamer é obrigatório']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail é obrigatória']
  },
  url: {
    type: String,
    required: [true, 'URL é obrigatória']
  },
  game: {
    type: String,
    required: [true, 'Jogo é obrigatório'],
    enum: ['valorant', 'csgo', 'lol', 'apex']
  },
  viewerCount: {
    type: Number,
    default: 0
  },
  isLive: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stream', StreamSchema);