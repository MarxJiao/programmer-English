const path = require('path');
const { getWords } = require('./getWords');
const { getMediaPaths } = require('./getFilePaths');
const { generateAudio } = require('./generateAudio/generateAudio');
const generateImage = require('./generateImage/generateImage');
const generateVideo = require('./generateVideo/generateVideo');
const mergeVideos = require('./mergeVidoes');
const TaskQueue = require('./utils/TaskQueue');
const resizeImage = require('./generateImage/resizeImage');

const convertToSeconds = (milliseconds) => (milliseconds / 1000).toFixed(3);

const getVideo = async (csvFile, startIndex = 1) => {

  const allStartTime = Date.now();

  const taskQueue = new TaskQueue(2);

  const absolutePath = path.resolve(csvFile);
  const dir = path.dirname(absolutePath);

  const words = await getWords(absolutePath);

  const wideoPaths = [];

  await taskQueue.addTasks(words.map(word => async () => {
    const wordStartTime = Date.now();
    const { wordAudioPath, wordImagePath, wordVideoPath, exampleAudioPath, exampleImagePath, exampleVideoPath } = await getMediaPaths(word.word, dir);

    await Promise.all([
      generateAudio(`${word.word}。${word.translation}`, wordAudioPath),
      generateImage(`${word.word}\n${word.pronunciation}\n${word.wordType} ${word.translation}`, wordImagePath),
      generateAudio(`${word.example}。${word.exampleTranslation}`, exampleAudioPath),
      generateImage(`${word.example}\n${word.exampleTranslation}`, exampleImagePath)
    ]);
    const allMediaGeneratedTime = Date.now();
    console.log(`单词 ${word.word} 的音频、图片生成完毕，耗时：${convertToSeconds(allMediaGeneratedTime - wordStartTime)}秒`);

    await Promise.all([
      generateVideo({ videoPath: wordVideoPath, audioPath: wordAudioPath, imagePath: wordImagePath }),
      generateVideo({ videoPath: exampleVideoPath, audioPath: exampleAudioPath, imagePath: exampleImagePath })
    ]);
    
    const allVideoGeneratedTime = Date.now();
    console.log(`单词 ${word.word} 的视频生成完毕，耗时：${convertToSeconds(allVideoGeneratedTime - allMediaGeneratedTime)}秒`);
    console.log(`单词 ${word.word} 总耗时：${convertToSeconds(allVideoGeneratedTime - wordStartTime)}秒`);
    await mergeVideos(path.join(dir, word.word, `wordWithExample.mp4`), [wordVideoPath, exampleVideoPath], null);
    wideoPaths.push(wordVideoPath);
    wideoPaths.push(exampleVideoPath);
  }));

  const allVideoGeneratedTime = Date.now();
  const allVideoDuration = allVideoGeneratedTime - allStartTime;
  console.log(`所有视频生成完毕，耗时：${convertToSeconds(allVideoDuration)}秒`);

  const coverPath = path.join(dir, 'cover.png');
  await generateImage(`程序员必备英语单词 ${startIndex}-${startIndex + words.length - 1}\n\n@MarkEnglish马克英语`, coverPath);
  const allCoverGeneratedTime = Date.now();
  console.log(`封面生成完毕，耗时：${convertToSeconds(allCoverGeneratedTime - allVideoGeneratedTime)}秒`);

  const smallCoverPath = path.join(dir, 'corver_small.png');
  await resizeImage({
    srcPath: coverPath,
    destPath: smallCoverPath,
    width: 1280,
    height: 720
  });
  const allCoverResizedTime = Date.now();
  console.log(`封面缩略图生成完毕，耗时：${convertToSeconds(allCoverResizedTime - allCoverGeneratedTime)}秒`);
  await mergeVideos(path.join(dir, 'video.mp4'), wideoPaths, coverPath);
  const allVideoMergedTime = Date.now();
  console.log(`视频合并完毕，耗时：${convertToSeconds(allVideoMergedTime - allCoverResizedTime)}秒`);
  console.log(`总耗时：${convertToSeconds(allVideoMergedTime - allStartTime)}秒`);
}

module.exports = {
  getVideo
}
