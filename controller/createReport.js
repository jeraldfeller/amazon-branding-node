const request = require('request');
const config = require('../config');

module.exports = (params, recordType, headers) => {
  return new Promise((resolve, reject) => {
    console.log(params, recordType)
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    if (recordType == 'keyword') {
      console.log('{' +
        'url: ' + config.ad_url + '/v1/' + recordType + '/report`,' +
        'method: "POST", ' +
        'headers: ' + headers + ',' +
        'json: ' + params + '}')
    }
    request({
      url: config.ad_url + `/v1/${recordType}/report`,
      method: "POST",
      headers: headers,
      json: params
    }, (err, httpResponse, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  })
}
