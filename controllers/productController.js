const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { game, category, inStock } = req.query;
    
    const query = {};
    
    if (game) {
      query.game = game;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }
    
    const products = await Product.find(query);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};