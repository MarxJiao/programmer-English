const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getAccessToken } = require('./getAccessToken');

const getAudioStream = async (text) => {
  const token = await getAccessToken();
  const options = {
    method: 'POST',
    url: 'https://tsn.baidu.com/text2audio',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    },
    responseType: 'stream', // Request stream response
    data: {
      'tex': encodeURIComponent(text),
      'tok': token,
      'cuid': 'programmer-English',
      'ctp': '1',
      'lan': 'zh',
      'spd': '4',
      'pit': '5',
      'vol': '5',
      'per': '4149',
      'aue': '3'
    }
  };
  return axios(options).then(response => response.data);
}

const generateAudio = async (text, filepath) => {
  const stream = await getAudioStream(text);
  return new Promise((resolve, reject) => {
    stream
      .pipe(fs.createWriteStream(filepath))
      .on('finish', () => resolve(filepath))
      .on('error', reject);
  });
}

module.exports = {
  generateAudio
}