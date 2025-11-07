const Notification = require('../models/Notification');

exports.sendNotification = async (req, res) => {
  try {
    const { taskId, message, type } = req.body;

    if (!message || !type) {
      return res.status(400).json({ message: 'Message and type are required' });
    }

    const notification = new Notification({
      userId: req.userId,
      taskId: taskId || null,
      message,
      type,
      sentAt: new Date()
    });

    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ sentAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.userId });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
