import { useState } from 'react';
import TaskList from '../components/TaskList';
import AddTaskButton from '../components/AddTaskButton';
import TaskModal from '../components/TaskModal';
import ShareTaskModal from '../components/ShareTaskModal';
import TaskHistoryModal from '../components/TaskHistoryModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import EmptyState from '../components/EmptyState';
import { FiFilter } from 'react-icons/fi';
import { TbArrowsSort } from 'react-icons/tb';

const Dashboard = ({ tasks, onTaskUpdate, onShareTask, searchQuery = '', user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToShare, setTaskToShare] = useState(null);
  const [taskToView, setTaskToView] = useState(null);
  const [historyTaskId, setHistoryTaskId] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [filterStatus, setFilterStatus] = useState('all');
  const [taskOrder, setTaskOrder] = useState([]);

  const filteredTasks = tasks
    .filter(task => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'default') {
        const indexA = taskOrder.indexOf(a._id);
        const indexB = taskOrder.indexOf(b._id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      }
      if (sortBy === 'urgency') return (b.urgencyScore || 0) - (a.urgencyScore || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleReorder = (fromIndex, toIndex) => {
    const newOrder = [...filteredTasks.map(t => t._id)];
    const [movedId] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedId);
    setTaskOrder(newOrder);
  };

  const handleSubmit = async (taskData, attachments) => {
    await onTaskUpdate(
      selectedTask ? { ...taskData, _id: selectedTask._id } : taskData,
      attachments
    );
    setSelectedTask(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-900/20 dark:to-blue-900/20">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl mb-1">🏆</span>
            <span className="text-xs sm:text-sm text-blue-100 dark:text-gray-400 mb-1">Total Points</span>
            <p className="text-xl sm:text-3xl font-bold text-white dark:text-blue-600">{user?.points || 0}</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg shadow-lg bg-gradient-to-br from-green-500 to-green-600 dark:from-green-900/20 dark:to-green-900/20">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl mb-1">🔥</span>
            <span className="text-xs sm:text-sm text-green-100 dark:text-gray-400 mb-1">Current Streak</span>
            <p className="text-xl sm:text-3xl font-bold text-white dark:text-green-600">{user?.streak || 0} <span className="text-sm sm:text-xl">days</span></p>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-900/20 dark:to-purple-900/20">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl mb-1">📋</span>
            <span className="text-xs sm:text-sm text-purple-100 dark:text-gray-400 mb-1">Total Tasks</span>
            <p className="text-xl sm:text-3xl font-bold text-white dark:text-purple-600">{tasks.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4 items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1 sm:flex-none">
          <FiFilter className="text-gray-400 flex-shrink-0" size={16} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:w-auto px-2 sm:px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-1 sm:flex-none">
          <TbArrowsSort className="text-gray-400 flex-shrink-0" size={16} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:w-auto px-2 sm:px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="default">Default</option>
            <option value="createdAt">Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState 
          message={searchQuery ? 'No tasks match your search' : filterStatus !== 'all' ? 'No tasks in this category' : 'No tasks yet'}
          action={!searchQuery && filterStatus === 'all' ? { label: 'Create your first task', onClick: () => setIsModalOpen(true) } : null}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          groupBy={null}
          onToggleComplete={(id) => onTaskUpdate({ _id: id, toggleComplete: true })}
          onEdit={(task) => { setSelectedTask(task); setIsModalOpen(true); }}
          onDelete={(id) => onTaskUpdate({ _id: id, delete: true })}
          onShare={(task) => { setTaskToShare(task); setIsShareModalOpen(true); }}
          onViewHistory={(id) => { setHistoryTaskId(id); setIsHistoryModalOpen(true); }}
          onViewDetails={(task) => { setTaskToView(task); setIsDetailsModalOpen(true); }}
          onReorder={handleReorder}
          isDraggable={sortBy === 'default'}
        />
      )}

      <AddTaskButton onClick={() => { setSelectedTask(null); setIsModalOpen(true); }} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
        onSubmit={handleSubmit}
        initialTask={selectedTask}
      />

      <ShareTaskModal
        isOpen={isShareModalOpen}
        onClose={() => { setIsShareModalOpen(false); setTaskToShare(null); }}
        task={taskToShare}
        onShare={onShareTask}
      />

      {isHistoryModalOpen && historyTaskId && (
        <TaskHistoryModal
          taskId={historyTaskId}
          onClose={() => { setIsHistoryModalOpen(false); setHistoryTaskId(null); }}
          onUndo={() => window.location.reload()}
        />
      )}

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setTaskToView(null); }}
        task={taskToView}
      />
    </div>
  );
};

export default Dashboard;
