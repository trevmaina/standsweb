const Sermon = require("../models/sermon");
const Event = require("../models/event");
const Product = require("../models/product");
const Order = require("../models/order");
const Intimation = require("../models/intimation");

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Parallel Counts for speed
    const [
      totalSermons,
      monthlySermons,
      totalEvents,
      upcomingEvents,
      products,
      orders,
      intimations,
    ] = await Promise.all([
      Sermon.countDocuments(),
      Sermon.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: now.toISOString().split("T")[0] } }),
      Product.countDocuments(),
      Order.countDocuments(),
      Intimation.countDocuments(),
    ]);

    // 2. Revenue Calculation (Paid only)
    const paidOrders = await Order.find({ status: "paid" });
    const totalRevenue = paidOrders.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0,
    );

    // 3. Robust Recent Activity Fetching
    const recentSermons = await Sermon.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    // Map them to a common format to avoid frontend errors
    const activities = [...recentSermons, ...recentEvents]
      .map((item) => ({
        title: item.title,
        category: item.category || "General",
        date: new Date(item.createdAt || Date.now()).toLocaleDateString(),
        rawDate: item.createdAt || 0,
      }))
      .sort((a, b) => b.rawDate - a.rawDate);

    res.status(200).json({
      success: true,
      data: {
        totalSermons,
        monthlySermons,
        totalEvents,
        upcomingEvents,
        products,
        orders,
        intimations,
        revenue: totalRevenue,
        recentActivity: activities,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
