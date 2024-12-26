const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const path = require('path');

const mergeVideos = async (exportPath, videoPaths, coverPath) => {
  const outputDir = path.dirname(exportPath);
  const randomValue = Math.random().toString(36).substring(2, 15);
  const listFile = path.join(outputDir, `temp_file_list_${randomValue}.txt`);
  const tempCoverVideo = path.join(outputDir, `temp_cover_${randomValue}.mp4`);

  try {
    // Create 5 second video from cover image
    if (coverPath && videoPaths.length > 0) {
      // 1. 使用 ffprobe 获取第一个视频的音频采样率
      const { stdout } = await execAsync(
        `ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 "${videoPaths[0]}"`
      );
      const sampleRate = parseInt(stdout.trim(), 10) || 48000; // 默认 48k
      
      // 2. 使用 anullsrc 生成静音音轨并创建封面视频
      await execAsync(
        `ffmpeg -loop 1 -i "${coverPath}" -f lavfi -i anullsrc=r=${sampleRate}:cl=stereo ` +
        `-c:v libx264 -t 3 -vf "scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2" ` +
        `-r 60 -pix_fmt yuv420p -c:a aac -shortest "${tempCoverVideo}"`
      );
    }

    // Create a file containing the list of videos to merge
    const allVideos = coverPath ? [tempCoverVideo, ...videoPaths] : videoPaths;
    const fileContent = allVideos.map(path => `file '${path}'`).join('\n');
    await fs.writeFile(listFile, fileContent);

    // Execute ffmpeg command to merge videos
    await execAsync(`ffmpeg -f concat -safe 0 -i ${listFile}  -c:v copy -c:a copy "${exportPath}"`);

    // Clean up temporary files
    await fs.unlink(listFile);
    if (coverPath) {
      await fs.unlink(tempCoverVideo);
    }

    return exportPath;
  } catch (error) {
    // Clean up temporary files if they exist
    try {
      await fs.access(listFile);
      await fs.unlink(listFile);
      if (coverPath) {
        await fs.access(tempCoverVideo);
        await fs.unlink(tempCoverVideo);
      }
    } catch (err) {
      // Files don't exist, ignore error
    }
    throw error;
  }
};

module.exports = mergeVideos;