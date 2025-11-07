import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiRepeat, FiUsers, FiPaperclip, FiCalendar, FiFlag } from 'react-icons/fi';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  const priorityColors = {
    low: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    high: 'text-red-600 bg-red-100 dark:bg-red-900/20'
  };

  const statusColors = {
    pending: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    completed: 'text-green-600 bg-green-100 dark:bg-green-900/20'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Task Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FiFlag className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </div>

                {task.dueDate && (
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due Date:</span>
                    <span className="text-sm font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {task.isRecurring && (
                  <div className="flex items-center space-x-2">
                    <FiRepeat className="text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recurring:</span>
                    <span className="text-sm font-medium capitalize">{task.recurringType}</span>
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.sharedWith && task.sharedWith.length > 0 && (
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-purple-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Shared with {task.sharedWith.length} user{task.sharedWith.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center space-x-2">
                    <FiPaperclip />
                    <span>Attachments ({task.attachments.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {task.attachments.map((file, idx) => {
                      const fileUrl = typeof file === 'string' ? file : file.url;
                      const fileName = fileUrl.split('/').pop();
                      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm truncate">{fileName}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`${baseUrl}${fileUrl}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={async () => {
                                const response = await fetch(`${baseUrl}${fileUrl}`);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = fileName;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              }}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t dark:border-gray-700">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                  {task.completedAt && (
                    <p>Completed: {new Date(task.completedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
