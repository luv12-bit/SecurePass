const express = require('express');
const { getStats, getUsers } = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);

module.exports = router;
