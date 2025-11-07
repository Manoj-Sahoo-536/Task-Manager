import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await taskAPI.getAll();
      setTasks(data.tasks || data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      toast.error(message);
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData, attachments = []) => {
    try {
      const { data } = await taskAPI.create(taskData);
      
      if (attachments.length > 0) {
        try {
          await taskAPI.uploadAttachments(data._id, attachments);
          const { data: updatedTask } = await taskAPI.getOne(data._id);
          setTasks([updatedTask, ...tasks]);
        } catch (attachError) {
          console.error('Attachment upload error:', attachError);
          setTasks([data, ...tasks]);
        }
      } else {
        setTasks([data, ...tasks]);
      }
      
      toast.success('Task created successfully');
      
      // Schedule reminder if due date exists (optional feature)
      if (data.dueDate) {
        try {
          const { useNotifications } = await import('./useNotifications');
          const { scheduleReminder } = useNotifications();
          scheduleReminder(data);
        } catch (notifError) {
          // Notification scheduling is optional, don't show error to user
          console.log('Notification scheduling not available');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      console.error('Create task error:', error);
      throw error; // Re-throw to prevent further execution
    }
  };

  const editTask = async (id, taskData, attachments = []) => {
    try {
      const { data } = await taskAPI.update(id, taskData);
      
      if (attachments.length > 0) {
        await taskAPI.uploadAttachments(id, attachments);
        const { data: updatedTask } = await taskAPI.getOne(id);
        setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      } else {
        setTasks(tasks.map(t => t._id === id ? data : t));
      }
      
      toast.success('Task updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      console.error('Update task error:', error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      console.error('Delete task error:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const { data } = await taskAPI.toggleComplete(id);
      
      // Update the current task status
      setTasks(tasks.map(t => t._id === id ? data : t));
      
      // Handle recurring tasks - only create next occurrence if completing (not uncompleting)
      if (data.status === 'completed' && task?.isRecurring && task.status !== 'completed') {
        try {
          const { generateNextOccurrence } = await import('../utils/recurringUtils');
          const nextTask = generateNextOccurrence(task);
          if (nextTask) {
            const { data: newTask } = await taskAPI.create(nextTask);
            setTasks(prev => [newTask, ...prev]);
            toast.success('Task completed! Next occurrence created');
            return;
          }
        } catch (err) {
          console.error('Failed to create recurring task:', err);
        }
      }
      
      toast.success('Task status updated');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      console.error('Toggle complete error:', error);
    }
  };

  const bulkComplete = async () => {
    if (selectedTasks.length === 0) return;
    try {
      await taskAPI.bulkComplete(selectedTasks);
      await fetchTasks();
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks marked as completed`);
    } catch (error) {
      toast.error('Failed to complete tasks');
    }
  };

  const bulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    if (!window.confirm(`Delete ${selectedTasks.length} tasks?`)) return;
    try {
      await taskAPI.bulkDelete(selectedTasks);
      setTasks(tasks.filter(t => !selectedTasks.includes(t._id)));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks deleted`);
    } catch (error) {
      toast.error('Failed to delete tasks');
    }
  };

  const undoAction = async (id) => {
    try {
      await taskAPI.undo(id);
      await fetchTasks();
      toast.success('Action undone');
    } catch (error) {
      toast.error('Failed to undo action');
    }
  };

  const shareTask = async (id, userIds) => {
    try {
      const { data } = await taskAPI.shareTask(id, userIds);
      setTasks(tasks.map(t => t._id === id ? data : t));
      toast.success('Task shared successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to share task';
      toast.error(message);
      console.error('Share task error:', error);
      throw error;
    }
  };

  const toggleTaskSelection = (id) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return {
    tasks,
    loading,
    selectedTasks,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    bulkComplete,
    bulkDelete,
    undoAction,
    shareTask,
    toggleTaskSelection
  };
};
