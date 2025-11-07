const Task = require('../models/Task');

exports.exportToCSV = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });

    const csvHeader = 'Title,Description,Status,Priority,Tags,Due Date,Created At,Completed At,Is Recurring,Recurring Type\n';
    const csvRows = tasks.map(task => {
      return [
        `"${task.title || ''}"`,
        `"${task.description || ''}"`,
        task.status || '',
        task.priority || '',
        `"${task.tags.join(', ')}"`,
        task.dueDate ? new Date(task.dueDate).toISOString() : '',
        new Date(task.createdAt).toISOString(),
        task.completedAt ? new Date(task.completedAt).toISOString() : '',
        task.isRecurring || false,
        task.recurringType || ''
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.exportToJSON = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.json');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
