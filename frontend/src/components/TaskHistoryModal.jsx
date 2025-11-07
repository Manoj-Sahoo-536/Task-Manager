import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdHistory, MdUndo } from 'react-icons/md';
import axios from 'axios';

const TaskHistoryModal = ({ taskId, onClose, onUndo }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [taskId]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/undo`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUndo?.();
      onClose();
    } catch (error) {
      console.error('Failed to undo:', error);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <MdHistory className="text-2xl text-blue-500" />
              <h2 className="text-xl font-bold dark:text-white">Task History</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <MdClose className="text-xl dark:text-white" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No history available</div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div key={entry._id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.action === 'created' ? 'bg-green-100 text-green-700' :
                          entry.action === 'updated' ? 'bg-blue-100 text-blue-700' :
                          entry.action === 'deleted' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {entry.action}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      {entry.previousState && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          Previous: {entry.previousState.title}
                        </div>
                      )}
                    </div>
                    {index === 0 && entry.previousState && (
                      <button
                        onClick={handleUndo}
                        className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                      >
                        <MdUndo /> Undo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskHistoryModal;
