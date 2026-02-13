// backend/server.js
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
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- ROUTES ---
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));
app.use(notFound);
app.use(errorHandler);

// Start the Dynamic Pricing Engine
startPriceScheduler();

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));