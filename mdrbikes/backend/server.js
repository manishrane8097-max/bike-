require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bikeRoutes = require('./routes/bikes');
const orderRoutes = require('./routes/orders');

const app = express();

// ── CORS ──
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:5500',  // Live Server (local dev)
    'http://localhost:5500',
  ],
  credentials: true,
}));

// ── BODY PARSER ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ success: true, message: '🏍️ MDR Bikes API is running!', version: '1.0.0' });
});

// ── ROUTES ──
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/orders', orderRoutes);

// ── 404 HANDLER ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── GLOBAL ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

// ── DATABASE + SERVER START ──
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
