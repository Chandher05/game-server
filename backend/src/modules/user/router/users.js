`use strict`

import express from 'express';
import userController from '../controller/users';

const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile/:userId', userController.getUserProfile);
router.put('/update', userController.updateUserProfile);

module.exports = router;
