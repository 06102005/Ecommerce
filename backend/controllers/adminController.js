const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Admin
 */
const getAdminStats = async (req, res) => {
  try {
    // Total counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Total revenue (ONLY paid orders)
    const paidOrders = await Order.find({ isPaid: true });

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};
/**
 * @desc    Get monthly sales (paid orders only)
 * @route   GET /api/admin/sales
 * @access  Admin
 */
const getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: { isPaid: true }
      },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" }
          },
          totalRevenue: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const formatted = sales.map((s) => ({
      year: s._id.year,
      month: s._id.month,
      revenue: s.totalRevenue,
      orders: s.orderCount
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Monthly sales error:", error);
    res.status(500).json({ message: "Failed to fetch sales data" });
  }
};


module.exports = { getAdminStats , getMonthlySales };
