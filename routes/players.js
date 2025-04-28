const express = require('express');
const router = express.Router();
const { getPlayers, getPlayer } = require('../controllers/playerController');

router.get('/', getPlayers);

router.get('/:id', getPlayer);

module.exports = router;