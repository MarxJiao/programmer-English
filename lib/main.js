const path = require('path');
const { getWords } = require('./getWords');
const { getMediaPaths } = require('./getFilePaths');
const { generateAudio } = require('./generateAudio/generateAudio');
const generateImage = require('./generateImage/generateImage');
const generateVideo = require('./generateVideo/generateVideo');
const mergeVideos = require('./mergeVidoes');

const getVideo = async (csvFile) => {
  const absolutePath = path.resolve(csvFile);
  const dir = path.dirname(absolutePath);

  const words = await getWords(absolutePath);

  const wideoPaths = [];

  for (const word of words) {
    console.log(word);
    const { audioPath, videoPath, imagePath } = await getMediaPaths(word.word, dir);
    await generateAudio(`${word.word}。${word.translation}`, audioPath);
    await generateImage(`${word.word}\n${word.pronunciation}\n${word.wordType} ${word.translation}`, imagePath);
    await generateVideo({ videoPath, audioPath, imagePath });
    wideoPaths.push(videoPath);
  }
  mergeVideos(path.join(dir, 'video.mp4'), wideoPaths);
}

module.exports = {
  getVideo
}
