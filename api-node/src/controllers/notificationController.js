const { 
    getNotifications, 
    countUnread, 
    markAsRead, 
    markAllAsRead, 
    createNotification 
} = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId; 
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

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