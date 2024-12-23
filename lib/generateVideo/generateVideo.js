const { exec } = require('child_process');
const util = require('util');
const crypto = require('crypto');
const execAsync = util.promisify(exec);

const generateTempFileName = () => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `temp_audio_${timestamp}_${random}.mp3`;
};

const generateVideo = async ({ videoPath, audioPath, imagePath }) => {
  const tempAudioFile = generateTempFileName();
  
  try {
    // Create concatenated audio with unique temp file
    await execAsync(`ffmpeg -y -i ${audioPath} -filter_complex "[0]adelay=200|200[a1];[0]adelay=200|200[a2];[a1][a2]concat=n=2:v=0:a=1[a]" -map "[a]" ${tempAudioFile}`);

    // Create video using the unique temp file
    await execAsync(`ffmpeg -y -loop 1 -i ${imagePath} -i ${tempAudioFile} -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -r 60 -s 3840x2160 -t $(ffprobe -i ${tempAudioFile} -show_entries format=duration -v quiet -of csv="p=0") -vf "scale=3840:2160" ${videoPath}`);

  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  } finally {
    // Remove the specific temporary audio file
    try {
      await execAsync(`rm ${tempAudioFile}`);
    } catch (cleanupError) {
      console.error(`Error cleaning up temp file ${tempAudioFile}:`, cleanupError);
    }
  }
};

module.exports = generateVideo;