import { FiEdit2, FiTrash2, FiClock, FiRepeat, FiPaperclip, FiUsers, FiShare2, FiEye, FiDownload } from 'react-icons/fi';
import { MdHistory } from 'react-icons/md';
import FileAttachment from './FileAttachment';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, onShare, onViewHistory, onViewDetails }) => {
  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Due today';
    return `${days}d left`;
  };

  const isTaskOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
  
  const getBorderColor = () => {
    // Always use priority colors for border, but add overdue background
    const priorityBorder = task.priority === 'high' ? 'border-red-500' : 
                          task.priority === 'medium' ? 'border-yellow-500' : 
                          'border-green-500';
    
    const overdueBackground = isTaskOverdue ? 'bg-red-50 dark:bg-red-900/10' : '';
    
    return `${priorityBorder} ${overdueBackground}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => onViewDetails?.(task)}
      className={`group relative bg-amber-50 dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 border-l-4 cursor-pointer h-full flex flex-col ${
        task.status === 'completed' ? 'opacity-60' : ''
      } ${getBorderColor()}`}
    >
      <div className="flex items-start space-x-2 sm:space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete(task._id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded text-blue-600 focus:ring-blue-500 flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className={`font-semibold text-base sm:text-lg ${task.status === 'completed' ? 'line-through' : ''} break-words`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">{task.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2 sm:mt-3 pr-20 sm:pr-32">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${priorityColors[task.priority]}`} />
                <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
              </div>
              
              {task.dueDate && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FiClock size={12} />
                    <span className="whitespace-nowrap">{getDaysUntilDue(task.dueDate)}</span>
                  </div>
                </>
              )}
              
              {task.isRecurring && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                    <FiRepeat size={12} />
                    <span className="capitalize hidden sm:inline">{task.recurringType}</span>
                  </div>
                </>
              )}
              
              {task.sharedWith && task.sharedWith.length > 0 && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <div className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400">
                    <FiUsers size={12} />
                    <span className="hidden sm:inline">Shared with {task.sharedWith.length}</span>
                    <span className="sm:hidden">{task.sharedWith.length}</span>
                  </div>
                </>
              )}
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      {task.attachments && task.attachments.length > 0 && (
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-1 rounded">
          <FiPaperclip size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{task.attachments.length}</span>
          {task.attachments.slice(0, 1).map((file, idx) => {
            const fileUrl = typeof file === 'string' ? file : file.url;
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const fileName = fileUrl.split('/').pop();
            
            const handleDownload = async (e) => {
              e.stopPropagation();
              try {
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
              } catch (error) {
                console.error('Download failed:', error);
              }
            };
            
            return (
              <div key={idx} className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`${baseUrl}${fileUrl}`, '_blank');
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Preview"
                >
                  <FiEye size={14} className="text-blue-600" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Download"
                >
                  <FiDownload size={14} className="text-green-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewHistory?.(task._id);
          }}
          className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded text-purple-600"
          title="View history"
        >
          <MdHistory size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(task);
          }}
          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-blue-600"
          title="Share task"
        >
          <FiShare2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
