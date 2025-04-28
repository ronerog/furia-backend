const express = require('express');
const router = express.Router();
const { getRewards } = require('../controllers/pointsController');

router.get('/', getRewards);

module.exports = router;