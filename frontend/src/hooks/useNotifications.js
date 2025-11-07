import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      toast.success('Notifications enabled');
      return true;
    } else {
      toast.warning('Notifications denied');
      return false;
    }
  };

  const sendNotification = (title, options = {}) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });
    }
  };

  const scheduleReminder = (task) => {
    if (!task.dueDate || permission !== 'granted') return;

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeUntilDue = dueDate - now;
    const oneDayBefore = timeUntilDue - (24 * 60 * 60 * 1000);

    if (oneDayBefore > 0) {
      setTimeout(() => {
        sendNotification('Task Reminder', {
          body: `"${task.title}" is due tomorrow`,
          tag: task._id
        });
      }, oneDayBefore);
    }

    if (timeUntilDue > 0) {
      setTimeout(() => {
        sendNotification('Task Due Now', {
          body: `"${task.title}" is due now!`,
          tag: task._id,
          requireInteraction: true
        });
      }, timeUntilDue);
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleReminder
  };
};
