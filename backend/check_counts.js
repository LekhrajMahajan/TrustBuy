const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
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
