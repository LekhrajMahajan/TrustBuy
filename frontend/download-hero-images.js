import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const heroDir = path.join(__dirname, 'public', 'hero');

if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });

const images = [
    {
        url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        file: 'slide1.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        file: 'slide2.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        file: 'slide3.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        file: 'slide4.jpg'
    }
];

const download = (url, dest) =>
    new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = (u) => {
            https.get(u, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    file.close();
                    return request(res.headers.location);
                }
                if (res.statusCode !== 200) {
                    file.close();
                    fs.unlink(dest, () => { });
                    return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
                }
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            }).on('error', (err) => { file.close(); fs.unlink(dest, () => { }); reject(err); });
        };
        request(url);
    });

(async () => {
    for (const img of images) {
        const dest = path.join(heroDir, img.file);
        console.log(`Downloading ${img.file}...`);
        try {
            await download(img.url, dest);
            const size = (fs.statSync(dest).size / 1024).toFixed(1);
            console.log(`  ✅ ${img.file} (${size} KB)`);
        } catch (e) {
            console.error(`  ❌ ${img.file}: ${e.message}`);
        }
    }
    console.log('Done.');
})();
