const express = require('express');
const router = express.Router();
const { 
  getStreams, 
  getStream, 
  getLiveStreams 
} = require('../controllers/streamController');


router.get('/', getStreams);

router.get('/live', getLiveStreams);

router.get('/:id', getStream);

module.exports = router;