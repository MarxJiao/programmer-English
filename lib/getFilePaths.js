const path = require('path');
const fs = require('fs').promises;

const getMediaPaths = async (text, basePath) => {
  await fs.mkdir(path.join(basePath, text), { recursive: true });
  return {
    wordAudioPath: path.join(basePath, text, 'word.mp3'),
    exampleAudioPath: path.join(basePath, text, 'example.mp3'),
    wordImagePath: path.join(basePath, text, 'word.png'),
    exampleImagePath: path.join(basePath, text, 'example.png'),
    wordVideoPath: path.join(basePath, text, 'word.mp4'),
    exampleVideoPath: path.join(basePath, text, 'example.mp4'),
  }
}

module.exports = {
  getMediaPaths
}