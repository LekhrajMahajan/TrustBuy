// backend/utils/priceScheduler.js
const cron = require('node-cron');
const Product = require('../models/productModel');

const calculateTrendPrice = (product) => {
  const { basePrice, sales } = product;
  let newPrice = basePrice;

  // LOGIC: Based on specific user requirement
  // "If a product is selling very well then its price will remain the same"
  if (sales > 10) { // Assuming >10 sales means "selling very well"
    newPrice = basePrice;
  }
  // "if the product is not in demand then its price will be between 30% to 60% of the base price"
  else {
    // Generate a random percentage between 0.30 and 0.60
    const randomFactor = Math.random() * (0.60 - 0.30) + 0.30;
    newPrice = basePrice * randomFactor;
  }

  return Math.round(newPrice);
};

const startPriceScheduler = () => {
  // Run every minute for testing (Changed from '0 * * * *' to '* * * * *')
  // बाद में इसे '0 * * * *' (हर घंटे) कर सकते हैं
  cron.schedule('* * * * *', async () => {
    console.log('--- Running Trend-Based Pricing Algorithm ---');

    try {
      const products = await Product.find({});

      for (const p of products) {
        const oldPrice = p.currentPrice;
        p.currentPrice = calculateTrendPrice(p);

        if (oldPrice !== p.currentPrice) {
          await p.save();
          console.log(`Updated [${p.name}]: Sales(${p.sales}) -> Price: ₹${oldPrice} to ₹${p.currentPrice}`);
        }
      }
    } catch (error) {
      console.error('Error in pricing scheduler:', error);
    }
  });
};

module.exports = startPriceScheduler;