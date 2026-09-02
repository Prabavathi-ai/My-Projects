const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route GET /analytics/revenue
 */
router.get("/revenue", protect, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    res.json(result[0] || { totalRevenue: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /analytics/monthly-sales
 */
router.get("/monthly-sales", protect, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /analytics/top-customers
 * @desc  Get top 5 customers with order count and total amount
 */
router.get("/top-customers", protect, async (req, res) => {
  try {
    const result = await Order.aggregate([
      // 1️⃣ Only completed orders
      { $match: { status: "completed" } },

      // 2️⃣ Group by customer name
      {
        $group: {
          _id: "$customerName",
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      },

      // 3️⃣ Sort by highest spending
      { $sort: { totalAmount: -1 } },

      // 4️⃣ Take top 5
      { $limit: 5 }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /analytics/monthly-orders
 * @desc  Get monthly completed order count
 */
router.get("/monthly-orders", protect, async (req, res) => {
  try {
    const result = await Order.aggregate([
      // Only completed orders
      { $match: { status: "completed" } },

      // Group by month
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 }
        }
      },

      // Sort by month
      { $sort: { _id: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
