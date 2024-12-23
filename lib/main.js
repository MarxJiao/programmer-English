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
    const { wordAudioPath, wordImagePath, wordVideoPath, exampleAudioPath, exampleImagePath, exampleVideoPath } = await getMediaPaths(word.word, dir);

    await Promise.all([
      generateAudio(`${word.word}。${word.translation}`, wordAudioPath),
      generateImage(`${word.word}\n${word.pronunciation}\n${word.wordType} ${word.translation}`, wordImagePath),
      generateAudio(`${word.example}。${word.exampleTranslation}`, exampleAudioPath),
      generateImage(`${word.example}\n${word.exampleTranslation}`, exampleImagePath)
    ]);

    await generateVideo({ videoPath: wordVideoPath, audioPath: wordAudioPath, imagePath: wordImagePath });
    await generateVideo({ videoPath: exampleVideoPath, audioPath: exampleAudioPath, imagePath: exampleImagePath });
    
    wideoPaths.push(wordVideoPath);
    wideoPaths.push(exampleVideoPath);
  }
  mergeVideos(path.join(dir, 'video.mp4'), wideoPaths);
}

module.exports = {
  getVideo
}
