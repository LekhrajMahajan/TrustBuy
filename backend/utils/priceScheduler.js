// backend/utils/priceScheduler.js
const cron = require('node-cron');
const Product = require('../models/productModel');

// A predefined list of premium brands to distinguish from "local" brands
const PREMIUM_BRANDS = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'puma', 'gucci', 'rolex', 'dell', 'hp', 'lenovo', 'asus', 'boat', 'jbl', 'oneplus'];

const calculateDynamicPrice = (product) => {
  const { basePrice, sales, stock, name, views, createdAt } = product;

  // Determine Brand Type
  const isPremiumBrand = PREMIUM_BRANDS.some(b => name?.toLowerCase().includes(b));

  // Determine Demand (High vs Low)
  // For example, if it has sold more than 5 or has a lot of views, it's high demand.
  const isHighDemand = sales > 5 || views > 50;

  // Determine Stock (High vs Low)
  // Below 10 is considered "less stock"
  const isLowStock = stock < 10 && stock > 0;

  // Determine if it was recently listed (in the beginning)
  // "in the beginning" means within 3 days
  const isNewProduct = createdAt ? (new Date() - new Date(createdAt)) < 3 * 24 * 60 * 60 * 1000 : true;

  let randomPercent = 1;

  if (isHighDemand && isLowStock) {
    // "if the stock is less and the product is in high demand then its price will also be high" -> 100% to 110%
    randomPercent = Math.random() * (1.10 - 1.00) + 1.00;
  }
  else if (isHighDemand && !isLowStock) {
    // "price of the product which is in high demand will be around the base price" -> 90% to 100%
    randomPercent = Math.random() * (1.00 - 0.90) + 0.90;
  }
  else if (!isHighDemand) {
    if (isNewProduct) {
      // "as soon as the user enters its base price, it will remain around the base price in the beginning"
      // Keep it around base price (95% to 105%) while it builds traction
      randomPercent = Math.random() * (1.05 - 0.95) + 0.95;
    } else {
      if (isLowStock) {
        // "if the stock is less and the demand of the product is less then its price will be 20% to 30%"
        if (isPremiumBrand) {
          randomPercent = Math.random() * (0.70 - 0.60) + 0.60;
        } else {
          randomPercent = Math.random() * (0.30 - 0.20) + 0.20;
        }
      }
      else {
        // "price of the product which is not in high demand will be 40% to 50% of the base price"
        if (isPremiumBrand) {
          randomPercent = Math.random() * (0.80 - 0.70) + 0.70;
        } else {
          randomPercent = Math.random() * (0.50 - 0.40) + 0.40;
        }
      }
    }
  }

  // Calculate final price
  let newPrice = Math.round(basePrice * randomPercent);

  // Safety net: Price should never be 0 or negative
  if (newPrice < 1) newPrice = 1;

  return newPrice;
};

const startPriceScheduler = () => {
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    console.log('--- Running Dynamic Smart Pricing Algorithm ---');

    try {
      const products = await Product.find({});
      const bulkOps = [];

      for (const p of products) {

        let newPrice = calculateDynamicPrice(p);

        // Update if the price has changed
        if (p.currentPrice !== newPrice) {
          bulkOps.push({
            updateOne: {
              filter: { _id: p._id },
              update: { $set: { currentPrice: newPrice } }
            }
          });

          // Log updates for a few products
          if (bulkOps.length <= 5) {
            console.log(`Updated [${p.name}]: Demand(${p.sales > 5 ? 'High' : 'Low'}) Stock(${p.stock < 10 ? 'Low' : 'High'}) -> Price: ₹${p.currentPrice} to ₹${newPrice}`);
          }
        }
      }

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
        console.log(`Successfully updated dynamic prices for ${bulkOps.length} products.`);
      } else {
        console.log('No dynamic price updates needed.');
      }

    } catch (error) {
      console.error('Error in dynamic pricing scheduler:', error.message);
    }
  });
};

module.exports = startPriceScheduler;