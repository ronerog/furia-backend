const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da recompensa é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  imageUrl: {
    type: String,
    required: [true, 'URL da imagem é obrigatória']
  },
  pointsCost: {
    type: Number,
    required: [true, 'Custo em pontos é obrigatório'],
    min: [1, 'Custo deve ser maior que 0']
  },
  active: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: -1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reward', RewardSchema);