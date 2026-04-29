const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { register, login, getMe, getEmployees } = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'employee', 'security']).withMessage('Invalid role'),
  validate
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], login);

router.get('/me', protect, getMe);
router.get('/employees', getEmployees);

module.exports = router;
