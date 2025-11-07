const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');
const csv = require('csv-parser');
const { Readable } = require('stream');

exports.importFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const tasks = [];
    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => {
        tasks.push({
          title: row.Title || row.title,
          description: row.Description || row.description,
          status: row.Status || row.status || 'pending',
          priority: row.Priority || row.priority || 'medium',
          tags: row.Tags || row.tags ? (row.Tags || row.tags).split(',').map(t => t.trim()) : [],
          dueDate: row['Due Date'] || row.dueDate || null,
          isRecurring: row['Is Recurring'] || row.isRecurring === 'true',
          recurringType: row['Recurring Type'] || row.recurringType || null,
          userId: req.userId
        });
      })
      .on('end', async () => {
        const createdTasks = await Task.insertMany(tasks);

        for (const task of createdTasks) {
          await TaskHistory.create({
            taskId: task._id,
            action: 'created',
            userId: req.userId
          });
        }

        res.json({ message: 'Tasks imported successfully', count: createdTasks.length });
      })
      .on('error', (error) => {
        res.status(500).json({ message: 'Error parsing CSV', error: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.importFromJSON = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const jsonData = JSON.parse(req.file.buffer.toString());
    
    if (!Array.isArray(jsonData)) {
      return res.status(400).json({ message: 'Invalid JSON format. Expected an array of tasks' });
    }

    const tasks = jsonData.map(task => ({
      title: task.title,
      description: task.description,
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      tags: task.tags || [],
      dueDate: task.dueDate || null,
      isRecurring: task.isRecurring || false,
      recurringType: task.recurringType || null,
      userId: req.userId
    }));

    const createdTasks = await Task.insertMany(tasks);

    for (const task of createdTasks) {
      await TaskHistory.create({
        taskId: task._id,
        action: 'created',
        userId: req.userId
      });
    }

    res.json({ message: 'Tasks imported successfully', count: createdTasks.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
