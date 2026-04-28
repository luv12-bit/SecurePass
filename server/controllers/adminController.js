const User = require('../models/User');
const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');

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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch raw visitors and group them manually in Javascript (De-AI approach)
    const recentVisitors = await Visitor.find({
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });

    const groupedData = {};
    recentVisitors.forEach(v => {
      const dateStr = v.createdAt.toISOString().split('T')[0];
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = 0;
      }
      groupedData[dateStr]++;
    });

    const visitorsPerDay = Object.keys(groupedData).map(date => {
      return { _id: date, count: groupedData[date] };
    });

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
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
