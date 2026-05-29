const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: true,
  },
  orderType: {
    type: String,
    enum: ['purchase', 'service', 'accessory'],
    default: 'purchase',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  contactPhone: {
    type: String,
  },
  statusHistory: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      note: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
