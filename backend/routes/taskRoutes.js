const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required')
], taskController.createTask);

router.get('/', auth, taskController.getTasks);

router.get('/:id', auth, taskController.getTask);

router.put('/:id', auth, taskController.updateTask);

router.delete('/:id', auth, taskController.deleteTask);

router.patch('/:id/complete', auth, taskController.toggleComplete);

router.post('/bulk-complete', auth, taskController.bulkComplete);

router.delete('/bulk-delete', auth, taskController.bulkDelete);

router.get('/search', auth, taskController.searchTasks);

router.get('/filter', auth, taskController.filterTasks);

router.post('/:id/recurring', auth, taskController.setupRecurring);

router.get('/suggestions', auth, taskController.getTaskSuggestions);

router.post('/:id/share', auth, taskController.shareTask);

router.post('/:id/attachments', auth, upload.array('files', 5), taskController.uploadAttachments);

router.get('/:id/history', auth, taskController.getTaskHistory);

router.post('/:id/undo', auth, taskController.undoLastAction);

module.exports = router;
