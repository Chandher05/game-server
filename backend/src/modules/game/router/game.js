`use strict`

import express from 'express';
import gameController from '../controller/game';

const router = express.Router();

router.post('/create', gameController.createGame);
router.post('/join', gameController.joinGame);
router.get('/currentGame/:userId', gameController.isUserPartOfGame);

module.exports = router;
