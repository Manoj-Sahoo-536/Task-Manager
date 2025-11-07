import { FiAlertCircle, FiClock } from 'react-icons/fi';
import { getHighPriorityToday, isOverdue } from '../utils/taskUtils';

const SmartSuggestions = ({ tasks }) => {
  const highPriorityToday = getHighPriorityToday(tasks);
  const overdueTasks = tasks.filter(isOverdue);
  
  if (highPriorityToday.length === 0 && overdueTasks.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
          <FiAlertCircle className="text-red-600 dark:text-red-400" size={24} />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              These tasks need immediate attention
            </p>
          </div>
        </div>
      )}
      
      {highPriorityToday.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-center space-x-3">
          <FiClock className="text-orange-600 dark:text-orange-400" size={24} />
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-300">
              {highPriorityToday.length} high-priority task{highPriorityToday.length > 1 ? 's' : ''} due today
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Focus on these tasks first
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
