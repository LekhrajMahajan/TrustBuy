// backend/server.js
// FIX: Force Node to use Google DNS to resolve MongoDB SRV records (fixes ECONNREFUSED on some networks)
require('dns').setServers(['8.8.8.8']);

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const startPriceScheduler = require('./utils/priceScheduler');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://trust-buy.vercel.app',
  'https://trustbuy.vercel.app',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (covers preview deployments too)
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Database Connection
// Database Connection
let mongoUri = process.env.MONGO_URI;

// FIX: Handle unencoded '@' in password if present
if (mongoUri && mongoUri.includes('Lekhraj@086')) {
  console.log('⚠️ Auto-correcting unencoded password in MONGO_URI...');
  mongoUri = mongoUri.replace('Lekhraj@086', 'Lekhraj%40086');
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- ROUTES ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// Start the Dynamic Pricing Engine
startPriceScheduler();

app.get('/', (req, res) => res.send('API is running...'));
app.get('/api/ping', (req, res) => res.status(200).json({ status: 'ok', timestamp: Date.now() }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));