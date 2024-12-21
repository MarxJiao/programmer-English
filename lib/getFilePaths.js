const path = require('path');
const fs = require('fs').promises;

const getMediaPaths = async (text, basePath) => {
  await fs.mkdir(path.join(basePath, text), { recursive: true });
  return {
    audioPath: path.join(basePath, text, 'audio.mp3'),
    videoPath: path.join(basePath, text, 'video.mp4'),
    imagePath: path.join(basePath, text, 'image.png')
  }
}

module.exports = {
  getMediaPaths
}