const axios = require('axios');

const AK = process.env.BAIDU_SPEECH_AK;
const SK = process.env.BAIDU_SPEECH_SK;

let token = '';

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {

  if (token) {
    return Promise.resolve(token)
  }

  let options = {
    'method': 'POST',
    'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => {
        token = res.data.access_token
        resolve(token)
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = {
  getAccessToken
}