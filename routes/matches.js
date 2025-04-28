const express = require('express');
const router = express.Router();
const { 
  getMatches, 
  getMatch, 
  getFeaturedMatches 
} = require('../controllers/matchController');

router.get('/', getMatches);

router.get('/featured', getFeaturedMatches);

router.get('/:id', getMatch);

module.exports = router;