const fs = require('fs');
const path = require('path');
const resizeImage = require('../lib/generateImage/resizeImage');
const { createCanvas, loadImage } = require('canvas');

test('resizeImage should resize the image to the given resolution', async () => {
    const inputImagePath = path.join(__dirname, 'input.png');
    const outputImagePath = path.join(__dirname, 'output.png');
    const targetWidth = 100;
    const targetHeight = 100;

    await resizeImage({
        srcPath: inputImagePath,
        destPath: outputImagePath,
        width: targetWidth,
        height: targetHeight
    });

    const resizedImage = await loadImage(outputImagePath);
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(resizedImage, 0, 0, targetWidth, targetHeight);

    expect(canvas.width).toBe(targetWidth);
    expect(canvas.height).toBe(targetHeight);
});
