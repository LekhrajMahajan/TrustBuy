require('dns').setServers(['8.8.8.8']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let mongoUri = process.env.MONGO_URI;
if (mongoUri && mongoUri.includes('Lekhraj@086')) {
    mongoUri = mongoUri.replace('Lekhraj@086', 'Lekhraj%40086');
}

mongoose.connect(mongoUri).then(async () => {
    console.log('Connected to DB');
    const Product = require('./models/productModel.js');
    const products = await Product.find({ image: { $regex: '^/TrustBuy' } });
    console.log(`Found ${products.length} products with /TrustBuy path`);

    for (let p of products) {
        if (p.image.includes('/TrustBuy/')) {
            p.image = p.image.replace('/TrustBuy/', '/');
            await p.save();
        }
    }
    console.log('Updated products successfully');

    // Also update orders if necessary
    const Order = require('./models/orderModel.js');
    const orders = await Order.find({ 'orderItems.image': { $regex: '^/TrustBuy' } });
    console.log(`Found ${orders.length} orders with /TrustBuy path`);

    for (let o of orders) {
        let updated = false;
        for (let item of o.orderItems) {
            if (item.image && item.image.includes('/TrustBuy/')) {
                item.image = item.image.replace('/TrustBuy/', '/');
                updated = true;
            }
        }
        if (updated) await o.save();
    }
    console.log('Updated orders successfully');
    process.exit(0);
}).catch(console.error);
