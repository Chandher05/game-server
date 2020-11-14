`use strict`

import express from 'express';
import gameController from '../controller/game';

const router = express.Router();

router.post('/create', gameController.createGame);
router.post('/join', gameController.joinGame);
router.get('/currentGame/:userId', gameController.isUserPartOfGame);
// router.post('/start', gameController.startGame);
router.post('/restart', gameController.restartGame);
router.get('/validGame/:gameId', gameController.validGame);
router.post('/nextRound', gameController.nextRound);
router.get('/allCards', gameController.allCards);
router.post('/quitFromLobby', gameController.quitFromLobby);
router.post('/quitFromGame', gameController.quitFromGame);
// router.delete('/reset/:gameId', gameController.resetGame);
// router.delete('/resetAllGames', gameController.resetAllGames);
router.post('/spectate', gameController.spectateGame);
router.post('/stopSpectate', gameController.stopSpectateGame);

module.exports = router;
