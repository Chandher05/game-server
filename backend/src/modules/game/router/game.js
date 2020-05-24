`use strict`

import express from 'express';
import gameController from '../controller/game';

const router = express.Router();

router.post('/create', gameController.createGame);
router.post('/join', gameController.joinGame);
router.get('/currentGame/:userId', gameController.isUserPartOfGame);
router.post('/start', gameController.startGame);
router.get('/reset/:gameId', gameController.resetGame);
router.get('/validGame/:gameId', gameController.validGame);

module.exports = router;
