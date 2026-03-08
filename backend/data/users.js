const bcrypt = require('bcryptjs');

// Helper to hash passwords securely
const hash = (pass) => bcrypt.hashSync(pass, 10);

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: hash('123'),
    role: 'admin',
  },
  {
    name: 'Seller One',
    email: 'seller@example.com',
    password: hash('123'),
    role: 'seller',
    sellerStats: { status: 'active', businessName: 'Demo Store' }
  },
  {
    name: 'John Buyer',
    email: 'buyer@example.com',
    password: hash('123'),
    role: 'buyer',
  },
];

module.exports = users;