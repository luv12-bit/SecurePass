const express = require('express');
const {
  registerVisitor,
  getVisitor,
  getVisitors,
  updateStatus,
  checkIn,
  checkOut,
  downloadPass,
} = require('../controllers/visitorController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/', registerVisitor); // Public registration
router.get('/:id', getVisitor); // Public pass view
router.get('/:id/download', downloadPass);
router.get('/', protect, getVisitors);
router.put('/:id/status', protect, authorize('employee', 'admin'), updateStatus);
router.post('/checkin', protect, authorize('security', 'admin'), checkIn);
router.post('/checkout', protect, authorize('security', 'admin'), checkOut);

module.exports = router;
