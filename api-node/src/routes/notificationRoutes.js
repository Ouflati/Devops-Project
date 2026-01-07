const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// List notifications
router.get('/', authMiddleware, notificationController.getNotifications);

// Get unread count (must come BEFORE /:id routes to avoid pattern conflicts)
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

// Mark all as read (must come BEFORE /:id routes to avoid pattern conflicts)
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead);

// Get single notification by ID
router.get('/:id', authMiddleware, notificationController.getNotificationById);

// Mark single notification as read
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

// Update notification
router.patch('/:id', authMiddleware, notificationController.updateNotification);

// Delete notification
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

// Create notification (requires auth)
router.post('/', authMiddleware, notificationController.createNotification);

module.exports = router;