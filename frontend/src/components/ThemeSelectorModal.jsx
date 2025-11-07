import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import { themes } from '../utils/themes';

const ThemeSelectorModal = ({ isOpen, onClose, currentTheme, onSelectTheme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Choose Theme</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(themes).map(([key, theme]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelectTheme(key);
                    onClose();
                  }}
                  className={`relative p-4 rounded-lg border-2 transition ${
                    currentTheme === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {currentTheme === key && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <FiCheck size={12} />
                    </div>
                  )}
                  
                  <div className="text-left mb-3">
                    <h3 className="font-semibold">{theme.name}</h3>
                  </div>
                  
                  <div className="flex space-x-1">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.success }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeSelectorModal;
