const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const taskValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  validate
];

const authValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const notificationValidation = [
  body('message').notEmpty().withMessage('Message is required'),
  body('type').isIn(['reminder', 'alert']).withMessage('Type must be reminder or alert'),
  validate
];

module.exports = { validate, taskValidation, authValidation, notificationValidation };
