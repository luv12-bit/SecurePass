const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const {
  registerVisitor,
  getVisitor,
  getVisitors,
  updateStatus,
  checkIn,
  checkOut,
  downloadPass,
} = require('../controllers/visitorController');

const upload = require('../middleware/upload');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/', upload, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  body('host').notEmpty().withMessage('Host is required'),
  validate
], registerVisitor); // Public registration

router.get('/:id', getVisitor); // Public pass view
router.get('/:id/download', downloadPass);
router.get('/', protect, getVisitors);
router.put('/:id/status', protect, authorize('employee', 'admin'), updateStatus);
router.post('/checkin', protect, authorize('security', 'admin'), checkIn);
router.post('/checkout', protect, authorize('security', 'admin'), checkOut);

module.exports = router;
