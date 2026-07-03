const Order = require("../model/Order.js");
const Product = require("../model/Product.js");
const User = require("../model/User.js");

const getAdminStatus = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({role:"user"});
    
    const orders = await Order.find({});

    const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenueData
    });

  }
  
  catch (error) {
    res.status(500).json({ message: "Error fetching admin status", error: error.message });
  }
}

module.exports = { getAdminStatus };