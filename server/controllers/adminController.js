const User = require('../models/User');
const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const totalVisitorsToday = await Visitor.countDocuments({
      createdAt: { $gte: today },
    });
    const activeVisitors = await Visitor.countDocuments({ status: 'in' });
    const pendingApprovals = await Visitor.countDocuments({ status: 'pending' });

    // Visitors per day for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const visitorsPerDay = await Visitor.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalVisitorsToday,
        activeVisitors,
        pendingApprovals,
        visitorsPerDay,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
