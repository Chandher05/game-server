`use strict`

import express from 'express';
import userController from '../controller/admin';

const router = express.Router();

router.get('/allUsers', userController.allUsers);
router.get('/messages', userController.getMessages);
router.post('/claim', userController.claimOldUsername);
router.post('/messages/seen/:messageId', userController.markMessageAsSeen);
router.post('/messages/unseen/:messageId', userController.markMessageAsUnseen);
router.post('/deactivate/:userId', userController.deactivateUser);

module.exports = router;
