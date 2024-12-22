const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const generateVideo = async ({ videoPath, audioPath, imagePath }) => {
  try {
        await execAsync(`ffmpeg -y -i ${audioPath} -filter_complex "[0]adelay=200|200[a1];[0]adelay=200|200[a2];[a1][a2]concat=n=2:v=0:a=1[a]" -map "[a]" temp_audio.mp3`);

    // Create the video with the image and the concatenated audio
    await execAsync(`ffmpeg -y -loop 1 -i ${imagePath} -i temp_audio.mp3 -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -r 60 -s 3840x2160 -t $(ffprobe -i temp_audio.mp3 -show_entries format=duration -v quiet -of csv="p=0") -vf "scale=3840:2160" ${videoPath}`);

  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  } finally {
    // Remove the temporary audio file
    try {
      await execAsync('rm temp_audio.mp3');
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }
  }
};

module.exports = generateVideo;