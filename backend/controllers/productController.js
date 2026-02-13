const Product = require('../models/productModel');

// @desc    Fetch all products (For Shop Page - Public)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('user', 'name sellerStats');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch logged-in seller's products (For Seller Dashboard - Private)
// ✅ FIX: Filter by req.user._id (Protected Route से आएगा)
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
const createProduct = async (req, res) => {
  try {
    const { name, basePrice, description, category, stock, image } = req.body;

    // ✅ FIX: Assigning the logged-in user's ID to the product
    const product = new Product({
      user: req.user._id,
      name,
      image,
      description,
      category,
      basePrice,
      currentPrice: basePrice,
      stock: Number(stock),
      rating: 0,
      numReviews: 0,
      sales: 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid product data' });
  }
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'name sellerStats');
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user is the owner
      if (product.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }

      await product.deleteOne(); // or product.remove() depending on mongoose version
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, basePrice, description, category, stock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user is the owner
      if (product.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this product' });
      }

      if (name) product.name = name;
      if (basePrice !== undefined && basePrice !== '') {
        product.basePrice = Number(basePrice);
        // Auto-update currentPrice if basePrice changes (simplistic logic, can be refined)
        product.currentPrice = Number(basePrice);
      }
      if (description) product.description = description;
      if (category) product.category = category;
      if (stock !== undefined && stock !== '') product.stock = Number(stock);
      if (image) product.image = image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getMyProducts,
  createProduct,
  getProductById,
  createProductReview,
  deleteProduct,
  updateProduct
};