const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const { notificationValidation } = require('../middleware/validate');

const router = express.Router();

router.post('/send', auth, notificationValidation, notificationController.sendNotification);

router.get('/', auth, notificationController.getNotifications);

router.patch('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
