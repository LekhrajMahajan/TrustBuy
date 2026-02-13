// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users'); // We will create this next
const products = require('./data/products'); // We will create this next
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const connectDB = require('./config/db');

dotenv.config();

// Connect to DB directly for this script
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // 1. Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Insert Users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id; // First user will be admin
    const sellerUser = createdUsers[1]._id; // Second user is seller

    // 3. Link Products to the Seller
    const sampleProducts = products.map((product) => {
      return { ...product, user: sellerUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}