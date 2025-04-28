const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  imageUrl: {
    type: String,
    required: [true, 'URL da imagem é obrigatória']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['clothing', 'accessories', 'games', 'other']
  },
  game: {
    type: String,
    enum: ['valorant', 'csgo', 'lol', 'apex', '']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);