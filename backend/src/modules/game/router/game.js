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
router.post('/nextRound', gameController.nextRound);
router.get('/allCards', gameController.allCards);
router.post('/quitFromLobby', gameController.quitFromLobby);
router.post('/quitFromGame', gameController.quitFromGame);

module.exports = router;
