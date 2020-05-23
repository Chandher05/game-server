`use strict`

import express from 'express';
import socketController from '../controller/socket';

const router = express.Router();

router.get('/', socketController.socketRoot);

module.exports = router;
