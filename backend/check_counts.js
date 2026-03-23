require('dns').setServers(['8.8.8.8']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');

dotenv.config();

let mongoUri = process.env.MONGO_URI;
if (mongoUri && mongoUri.includes('Lekhraj@086')) {
    mongoUri = mongoUri.replace('Lekhraj@086', 'Lekhraj%40086');
}

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('MongoDB Connected');
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    console.log(`Products: ${productCount}`);
    console.log(`Users: ${userCount}`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
