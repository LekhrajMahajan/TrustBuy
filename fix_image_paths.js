const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'data', 'products.js');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find image: "imageX.ext" and replace with image: "/images/imageX.ext"
// Avoid replacing if it already starts with / or http
content = content.replace(/image:\s*"(?!(\/|http|data:))([^"]+)"/g, 'image: "/images/$2"');

fs.writeFileSync(filePath, content);
console.log('Fixed image paths in products.js');
