require('dotenv').config();
const { getVideo } = require('./lib/main');
const csvFilePath = process.argv[2];
const startIndex = +process.argv[3] || 1;

getVideo(csvFilePath, startIndex);
