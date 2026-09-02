const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @route POST /orders
 * @desc  Create single order
 */
router.post("/", protect, async (req, res) => {
  try {
    const { customerName, product, amount, status } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      customerName,
      product,
      amount,
      status,
    });

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("newOrder", order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /orders
 * @desc  Get all orders
 */
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /orders/bulk
 * @desc  Insert multiple orders
 */
router.post("/bulk", protect, async (req, res) => {
  try {
    const orders = req.body;

    const ordersWithUser = orders.map((order) => ({
      ...order,
      userId: req.user.id,
    }));

    const result = await Order.insertMany(ordersWithUser);

    // 🔥 Emit real-time update for bulk insert
    const io = req.app.get("io");
    io.emit("newOrder", result);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route PUT /orders/update-status
 * @desc  Update status of multiple orders
 */
router.put("/update-status", protect, async (req, res) => {
  try {
    const { oldStatus, newStatus } = req.body;

    const result = await Order.updateMany(
      { status: oldStatus },
      { $set: { status: newStatus } }
    );

    res.json({
      message: "Orders updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route DELETE /orders/delete
 * @desc  Delete orders by status
 */
router.delete("/delete", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await Order.deleteMany({ status });

    res.json({
      message: "Orders deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
