const { 
    getNotifications,
    getNotificationById,
    countUnread, 
    markAsRead, 
    markAllAsRead, 
    createNotification,
    updateNotification,
    deleteNotification
} = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // NEW: ergonomics
    const isRead = req.query.is_read; // '0' | '1'
    const type = req.query.type; // e.g. 'message'
    const sort = (req.query.sort || 'desc').toLowerCase(); // 'asc' | 'desc'
    const withMeta = req.query.meta === 'true';

    if (withMeta || isRead !== undefined || type || sort) {
      const { items, total } = await getNotificationsFiltered(userId, { limit, offset, isRead, type, sort });
      return res.json({ items, meta: { total, limit, offset } });
    }

    const notifications = await getNotifications(userId, limit, offset);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await countUnread(req.userId);
    res.json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await getNotificationById(id, req.userId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await markAsRead(id, req.userId);

    if (!success) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification marquée comme lue' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await markAllAsRead(req.userId);
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { recipient_id, type, message } = req.body;

    if (!recipient_id || !type || !message) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const notificationId = await createNotification(recipient_id, type, message);
    res.status(201).json({ 
      message: 'Notification créée avec succès', 
      notificationId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }

    const success = await updateNotification(id, req.userId, updates);

    if (!success) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification mise à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteNotification(id, req.userId);

    if (!success) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};