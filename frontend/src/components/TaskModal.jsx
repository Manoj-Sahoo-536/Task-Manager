import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPaperclip } from 'react-icons/fi';
import FileAttachment from './FileAttachment';
import VoiceInput from './VoiceInput';

const TaskModal = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    dueDate: initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '',
    priority: initialTask?.priority || 'medium',
    tags: initialTask?.tags?.join(', ') || '',
    isRecurring: initialTask?.isRecurring || false,
    recurringType: initialTask?.recurringType || 'daily'
  });
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState(initialTask?.attachments || []);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '',
        priority: initialTask.priority || 'medium',
        tags: initialTask.tags?.join(', ') || '',
        isRecurring: initialTask.isRecurring || false,
        recurringType: initialTask.recurringType || 'daily'
      });
      setExistingAttachments(initialTask.attachments || []);
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        tags: '',
        isRecurring: false,
        recurringType: 'daily'
      });
      setExistingAttachments([]);
    }
    setAttachments([]);
  }, [initialTask, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }, attachments);
      onClose();
    } catch (error) {
      // Error already handled by onSubmit
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-10 my-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{initialTask ? 'Edit Task' : 'Add Task'}</h2>
              <div className="flex items-center gap-2">
                {!initialTask && (
                  <VoiceInput
                    onResult={(data) => setFormData({ ...formData, ...data })}
                  />
                )}
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="work, urgent, personal"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium">Recurring Task</label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData({ ...formData, recurringType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Attachments</label>
                <div className="border-2 border-dashed rounded-lg p-4 dark:border-gray-600">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-700"
                  >
                    <FiPaperclip size={20} />
                    <span className="text-sm">Click to upload files</span>
                  </label>
                  <p className="text-xs text-gray-500 text-center mt-1">Max 5MB per file</p>
                </div>

                {existingAttachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">Existing files:</p>
                    {existingAttachments.map((file, idx) => (
                      <FileAttachment
                        key={idx}
                        file={file}
                        isExisting={true}
                        onRemove={() => removeExistingAttachment(idx)}
                      />
                    ))}
                  </div>
                )}

                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">New files:</p>
                    {attachments.map((file, idx) => (
                      <FileAttachment
                        key={idx}
                        file={file}
                        isExisting={false}
                        onRemove={() => removeAttachment(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (initialTask ? 'Update' : 'Create')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 rounded-lg font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
