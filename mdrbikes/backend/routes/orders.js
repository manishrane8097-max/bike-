const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Bike = require('../models/Bike');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/orders — customer places an order
router.post('/', protect, async (req, res) => {
  try {
    const { bikeId, orderType, message, address, contactPhone } = req.body;

    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found.' });
    if (!bike.available) return res.status(400).json({ success: false, message: 'Bike is not available.' });

    const order = await Order.create({
      customer: req.user._id,
      bike: bikeId,
      orderType: orderType || 'purchase',
      amount: bike.price,
      message,
      address,
      contactPhone,
      statusHistory: [{ status: 'pending', note: 'Order placed by customer.' }],
    });

    await order.populate(['customer', 'bike']);
    res.status(201).json({ success: true, message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not place order.' });
  }
});

// GET /api/orders/my — customer: view their own orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('bike', 'name type price imageUrl')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch orders.' });
  }
});

// GET /api/orders — admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('bike', 'name type price')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch orders.' });
  }
});

// PATCH /api/orders/:id/status — admin: update order status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    await order.save();
    await order.populate(['customer', 'bike']);

    res.json({ success: true, message: 'Order status updated!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update order status.' });
  }
});

// GET /api/orders/stats — admin: dashboard stats
router.get('/stats/summary', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'pending' });
    const delivered = await Order.countDocuments({ status: 'delivered' });
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'processing', 'ready', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pending,
        delivered,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch stats.' });
  }
});

module.exports = router;
