const path = require('path');
const fs = require('fs').promises;

const getWords = async (csvFile) => {
  const absolutePath = path.resolve(csvFile);
  
  try {
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    // Skip header and parse remaining lines
    const words = lines.slice(1).map(line => {
      const [word, pronunciation, wordType,  translation] = line.split(',').map(item => item.trim());
      return {
        word,
        pronunciation,
        wordType,
        translation
      };
    });

    return words;
  } catch (error) {
    console.error(`Error reading CSV file: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getWords
};