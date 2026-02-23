const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Function to get all files in a directory recursively
const getAllFiles = function (dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
};

const jsxFiles = getAllFiles(srcDir).filter(f => f.endsWith('.jsx'));

jsxFiles.forEach(file => {
    // We updated Navbar.jsx and App.jsx manually, let's skip them
    if (file.includes('Navbar.jsx') || file.includes('App.jsx')) {
        return;
    }

    let content = fs.readFileSync(file, 'utf-8');

    // Regexes to carefully prepend space + dark:class 
    // Make sure not to duplicate if we run it twice
    // Backgrounds
    content = content.replace(/bg-white(?!\s*dark:)/g, 'bg-white dark:bg-gray-900');
    content = content.replace(/bg-gray-50(?!\s*dark:)/g, 'bg-gray-50 dark:bg-gray-950');
    content = content.replace(/bg-gray-100(?!\s*dark:)/g, 'bg-gray-100 dark:bg-gray-800');
    content = content.replace(/bg-gray-200(?!\s*dark:)/g, 'bg-gray-200 dark:bg-gray-700');
    // Specific absolute black -> make white
    content = content.replace(/bg-black(?!\s*dark:)/g, 'bg-black dark:bg-white');

    // Texts
    content = content.replace(/text-black(?!\s*dark:)/g, 'text-black dark:text-white');
    content = content.replace(/text-gray-900(?!\s*dark:)/g, 'text-gray-900 dark:text-gray-100');
    content = content.replace(/text-gray-800(?!\s*dark:)/g, 'text-gray-800 dark:text-gray-200');
    content = content.replace(/text-gray-600(?!\s*dark:)/g, 'text-gray-600 dark:text-gray-400');
    content = content.replace(/text-gray-500(?!\s*dark:)/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/text-white(?!\s*dark:text-black)(?!\s*dark:)/g, 'text-white dark:text-black');

    // Borders
    content = content.replace(/border-gray-100(?!\s*dark:)/g, 'border-gray-100 dark:border-gray-800');
    content = content.replace(/border-gray-200(?!\s*dark:)/g, 'border-gray-200 dark:border-gray-700');
    content = content.replace(/border-black(?!\s*dark:)/g, 'border-black dark:border-white');

    fs.writeFileSync(file, content, 'utf-8');
});

console.log('Successfully injected dark mode classes into ' + jsxFiles.length + ' files.');
