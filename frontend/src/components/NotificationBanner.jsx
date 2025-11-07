import { FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotificationBanner = ({ onEnable, permission }) => {
  if (permission === 'granted' || permission === 'denied') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <FiBell className="text-blue-600 dark:text-blue-400" size={24} />
        <div>
          <p className="font-semibold text-blue-800 dark:text-blue-300">
            Enable Notifications
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Get reminders for upcoming tasks
          </p>
        </div>
      </div>
      <button
        onClick={onEnable}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
      >
        Enable
      </button>
    </motion.div>
  );
};

export default NotificationBanner;
