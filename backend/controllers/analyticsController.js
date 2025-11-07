const Task = require('../models/Task');

exports.getOverview = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ userId: req.userId });
    const completedTasks = await Task.countDocuments({ userId: req.userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId: req.userId, status: 'pending' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = await Task.countDocuments({
      userId: req.userId,
      status: 'pending',
      dueDate: { $lt: today }
    });

    const tasksByPriority = await Task.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const tasksByTag = await Task.aggregate([
      { $match: { userId: req.userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
      tasksByPriority,
      tasksByTag
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductivity = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const dailyCompletion = await Task.aggregate([
      {
        $match: {
          userId: req.userId,
          status: 'completed',
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyCreated = await Task.aggregate([
      {
        $match: {
          userId: req.userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      dailyCompletion,
      dailyCreated,
      period: `${days} days`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStreaks = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    const completedDates = await Task.aggregate([
      {
        $match: {
          userId: req.userId,
          status: 'completed',
          completedAt: { $ne: null }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completedDates.length; i++) {
      const date = new Date(completedDates[i]._id);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (date.toDateString() === expectedDate.toDateString()) {
        tempStreak++;
        if (i === 0 || currentStreak > 0) currentStreak = tempStreak;
      } else {
        break;
      }
    }

    maxStreak = user.streak || tempStreak;

    res.json({
      currentStreak,
      maxStreak,
      totalCompletedDays: completedDates.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBottlenecks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.find({
      userId: req.userId,
      status: 'pending',
      dueDate: { $lt: today }
    }).sort({ dueDate: 1 }).limit(10);

    const longPendingTasks = await Task.find({
      userId: req.userId,
      status: 'pending'
    }).sort({ createdAt: 1 }).limit(10);

    const highPriorityPending = await Task.countDocuments({
      userId: req.userId,
      status: 'pending',
      priority: 'high'
    });

    res.json({
      overdueTasks,
      longPendingTasks,
      highPriorityPending,
      totalOverdue: overdueTasks.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
