const express = require('express');
const { register, login, getMe, getEmployees } = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/employees', getEmployees);

module.exports = router;
