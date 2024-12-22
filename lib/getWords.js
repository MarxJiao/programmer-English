const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const getWords = (csvFile) => {
  return new Promise((resolve, reject) => {
    const words = [];
    const absolutePath = path.resolve(csvFile);

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on('data', (data) => {
        words.push({
          word: data.word?.trim(),
          pronunciation: data.pronunciation?.trim(),
          wordType: data.wordType?.trim(),
          translation: data.translation?.trim(),
          example: data.example?.trim(),
          exampleTranslation: data.exampleTranslation?.trim()
        });
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${error.message}`);
        reject(error);
      })
      .on('end', () => {
        resolve(words);
      });
  });
};

module.exports = {
  getWords
};