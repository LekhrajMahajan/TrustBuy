require('dns').setServers(['8.8.8.8']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config();

let mongoUri = process.env.MONGO_URI;
if (mongoUri && mongoUri.includes('Lekhraj@086')) {
    mongoUri = mongoUri.replace('Lekhraj@086', 'Lekhraj%40086');
}

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to DB');
    const products = await Product.find({}, 'name image').limit(10);
    console.log('Sample Products from DB:');
    products.forEach(p => console.log(`- ${p.name}: ${p.image}`));
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
