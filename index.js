require('dotenv').config();
const { getVideo } = require('./lib/main');
const csvFilePath = process.argv[2];

getVideo(csvFilePath);
