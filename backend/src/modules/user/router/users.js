`use strict`

import express from 'express';
import userController from '../controller/users';
import upload from '../../../utils/multer';

const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile/:userId', userController.getUserProfile);
router.put('/update', userController.updateUserProfile);
router.post('/report', upload.array('files', 10), userController.reportBug);
router.get('/stats/:userId', userController.getStats);

module.exports = router;
