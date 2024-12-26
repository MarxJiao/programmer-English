const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function resizeImage({ srcPath, destPath, width, height }) {
    const image = await loadImage(srcPath);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, width, height);
    const buffer = canvas.toBuffer();
    fs.writeFileSync(destPath, buffer);
}

module.exports = resizeImage;
