const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const path = require('path');

const mergeVideos = async (exportPath, videoPaths) => {
  const listFile = path.join(__dirname, './temp_file_list.txt');

  try {
    // Create a file containing the list of videos to merge
    const fileContent = videoPaths.map(path => `file '${path}'`).join('\n');
    await fs.writeFile(listFile, fileContent);

    // Execute ffmpeg command to merge videos
    await execAsync(`ffmpeg -f concat -safe 0 -i ${listFile} -c copy "${exportPath}"`);

    // Clean up temporary file
    await fs.unlink(listFile);

    return exportPath;
  } catch (error) {
    // Clean up temporary file if it exists
    try {
      await fs.access(listFile);
      await fs.unlink(listFile);
    } catch (err) {
      // File doesn't exist, ignore error
    }
    throw error;
  }
};

module.exports = mergeVideos;