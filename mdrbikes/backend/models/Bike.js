const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bike name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Road', 'Mountain', 'Electric', 'Sport', 'Cruiser', 'Urban', 'Other'],
  },
  category: {
    type: String,
    enum: ['bicycle', 'motorcycle'],
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 1,
  },
  available: {
    type: Boolean,
    default: true,
  },
  specs: {
    brand: String,
    model: String,
    year: Number,
    color: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bike', bikeSchema);
