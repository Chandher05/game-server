`use strict`

import express from 'express';
import userController from '../controller/users';
import upload from '../../../utils/multer';

const router = express.Router();

router.post('/login', userController.loginUser);
router.get('/profile/:userId', userController.getUserProfile);
router.put('/update', userController.updateUserProfile);
router.get('/stats/:userId', userController.getStats);
router.get('/leaderboard', userController.leaderboard);
router.get('/allUsers', userController.allUsers);
router.post('/sendMessage', userController.sendMessage);

module.exports = router;
