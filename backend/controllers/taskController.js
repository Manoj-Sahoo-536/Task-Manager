const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      userId: req.userId
    });

    await task.save();

    await TaskHistory.create({
      taskId: task._id,
      action: 'created',
      userId: req.userId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, priority, tags, sort, page = 1, limit = 10 } = req.query;
    
    const query = {
      $or: [
        { userId: req.userId },
        { sharedWith: req.userId }
      ]
    };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tags) query.tags = { $in: tags.split(',') };

    let sortOption = {};
    if (sort === 'dueDate') sortOption.dueDate = 1;
    else if (sort === 'priority') sortOption.priority = -1;
    else if (sort === 'urgency') sortOption.urgencyScore = -1;
    else sortOption.createdAt = -1;

    const tasks = await Task.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const previousState = task.toObject();

    Object.assign(task, req.body);
    await task.save();

    await TaskHistory.create({
      taskId: task._id,
      action: 'updated',
      previousState,
      userId: req.userId
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await TaskHistory.create({
      taskId: task._id,
      action: 'deleted',
      previousState: task.toObject(),
      userId: req.userId
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleComplete = async (req, res) => {
  try {
    const User = require('../models/User');
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const wasCompleted = task.status === 'completed';
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    task.completedAt = task.status === 'completed' ? new Date() : null;
    await task.save();

    // Award or remove points and update streak
    if (task.status === 'completed' && !wasCompleted) {
      const pointsMap = { low: 5, medium: 10, high: 15 };
      const user = await User.findById(req.userId);
      
      // Check if user completed a task today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const completedToday = await Task.findOne({
        userId: req.userId,
        status: 'completed',
        completedAt: { $gte: today },
        _id: { $ne: task._id }
      });
      
      // Update streak if this is first task completed today
      if (!completedToday) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const completedYesterday = await Task.findOne({
          userId: req.userId,
          status: 'completed',
          completedAt: { $gte: yesterday, $lt: today }
        });
        
        if (completedYesterday) {
          await User.findByIdAndUpdate(req.userId, {
            $inc: { points: pointsMap[task.priority] || 10, streak: 1 }
          });
        } else {
          await User.findByIdAndUpdate(req.userId, {
            $inc: { points: pointsMap[task.priority] || 10 },
            $set: { streak: 1 }
          });
        }
      } else {
        await User.findByIdAndUpdate(req.userId, {
          $inc: { points: pointsMap[task.priority] || 10 }
        });
      }
    } else if (task.status === 'pending' && wasCompleted) {
      const pointsMap = { low: 5, medium: 10, high: 15 };
      await User.findByIdAndUpdate(req.userId, {
        $inc: { points: -(pointsMap[task.priority] || 10) }
      });
    }

    await TaskHistory.create({
      taskId: task._id,
      action: 'completed',
      userId: req.userId
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bulkComplete = async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    await Task.updateMany(
      { _id: { $in: taskIds }, userId: req.userId },
      { status: 'completed', completedAt: new Date() }
    );

    res.json({ message: 'Tasks marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    await Task.deleteMany({ _id: { $in: taskIds }, userId: req.userId });

    res.json({ message: 'Tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const tasks = await Task.find({
      userId: req.userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.filterTasks = async (req, res) => {
  try {
    const { status, priority, tags, dueDateFrom, dueDateTo, isRecurring } = req.query;
    
    const query = { userId: req.userId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tags) query.tags = { $in: tags.split(',') };
    if (isRecurring !== undefined) query.isRecurring = isRecurring === 'true';
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.setupRecurring = async (req, res) => {
  try {
    const { recurringType } = req.body;
    
    if (!['daily', 'weekly', 'monthly'].includes(recurringType)) {
      return res.status(400).json({ message: 'Invalid recurring type' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isRecurring = true;
    task.recurringType = recurringType;
    await task.save();

    await TaskHistory.create({
      taskId: task._id,
      action: 'updated',
      userId: req.userId
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskSuggestions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.find({
      userId: req.userId,
      status: 'pending',
      dueDate: { $lt: today }
    }).sort({ dueDate: 1 }).limit(5);

    const highPriorityToday = await Task.find({
      userId: req.userId,
      status: 'pending',
      priority: 'high',
      dueDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).limit(5);

    const highUrgency = await Task.find({
      userId: req.userId,
      status: 'pending'
    }).sort({ urgencyScore: -1 }).limit(5);

    res.json({
      overdue: overdueTasks,
      highPriorityToday,
      highUrgency
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.shareTask = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.sharedWith = [...new Set([...task.sharedWith, ...userIds])];
    await task.save();

    await TaskHistory.create({
      taskId: task._id,
      action: 'updated',
      userId: req.userId
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.uploadAttachments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    task.attachments = [...task.attachments, ...fileUrls];
    await task.save();

    await TaskHistory.create({
      taskId: task._id,
      action: 'updated',
      userId: req.userId
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskHistory = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const history = await TaskHistory.find({ taskId: req.params.id }).sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.undoLastAction = async (req, res) => {
  try {
    const lastHistory = await TaskHistory.findOne({ taskId: req.params.id, userId: req.userId }).sort({ timestamp: -1 });
    
    if (!lastHistory || !lastHistory.previousState) {
      return res.status(400).json({ message: 'No action to undo' });
    }

    if (lastHistory.action === 'deleted') {
      const restoredTask = new Task({ ...lastHistory.previousState, _id: req.params.id });
      await restoredTask.save();
      await lastHistory.deleteOne();
      return res.json(restoredTask);
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, lastHistory.previousState);
    await task.save();
    await lastHistory.deleteOne();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
