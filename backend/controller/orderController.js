const Order = require("../model/Order.js");
const SendEmail = require("../utils/sendEmail.js");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || !totalAmount || !address || !paymentId) {
      return res.status(400).json({ message: "All fields are required" });
    } else {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentId,
      });
      await order.save();
      // Send order confirmation email
      const message = `Dear ${req.user.name},\n\nThank you for your order! Your order has been successfully placed. Here are the details of your order:\n\nOrder ID: ${order._id}\nTotal Amount: $${totalAmount}\nShipping Address: ${address}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nE-commerce Team`;

      await SendEmail(req.user.email, "Order Confirmation", message);
      res.status(201).json({ message: "Order created successfully", order });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 

// Get My Orders
const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.productId", "name price");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Orders (Admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    } 
    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } 
};

module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
};