`use strict`

import express from 'express';
import playerController from '../controller/player';

const router = express.Router();

router.get('/cards/:gameId/:userId', playerController.currentCards);
router.post('/dropCards', playerController.dropCards);
router.post('/declare', playerController.declare);

module.exports = router;
