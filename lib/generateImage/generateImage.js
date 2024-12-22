const canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = canvas;
const fontPath = path.join(__dirname, 'HarmonyOS_Sans_SC_Regular.ttf');
try {
  registerFont(fontPath, {
    family: 'HarmonyOS_Sans_SC_Regular',
    weight: '500',
    style: 'normal',
  });
} catch (error) {
  console.error('Font registration error:', error);
}
const fontSize = 160;
const lineHeight = fontSize * 1.6;
const width = 3840;
const height = 2160;
const marginX = 650;
const maxWidth = width - 2 * marginX;

const wrapText = (ctx, text, maxWidth) => {
  // Split text into a mix of words and CJK characters
  const segments = text.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+|\s+|[^\s\u4e00-\u9fa5a-zA-Z0-9]+/g) || [];
  const lines = [];
  let currentLine = '';

  for (const segment of segments) {
    const testLine = currentLine + segment;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = segment;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
};

const generateImage = async (text, imagePath) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(path.join(__dirname, 'background.png'));
  ctx.drawImage(background, 0, 0, width, height);

  // Set text properties
  ctx.font = `${fontSize}px "HarmonyOS_Sans_SC_Regular", "Microsoft YaHei", "SimHei", sans-serif`;
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Split text into lines and wrap long lines
  const inputLines = text.split('\n');
  const wrappedLines = inputLines.flatMap(line => wrapText(ctx, line, maxWidth));
  const textHeight = wrappedLines.length * lineHeight;
  const startY = height / 2 - (textHeight / 2) + (fontSize / 2);

  // Draw each line of text
  wrappedLines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, width / 2, y);
  });

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(imagePath, buffer);
};

module.exports = generateImage;