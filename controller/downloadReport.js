const request = require('request');
const zlib = require('zlib');
const getReport = require('./getReport');
const fs = require('fs')
const path = require('path')
const url = require('url');
const db = require('../helpers/database');

module.exports = function (reportId, type, headers, profile) {
  return new Promise(async (resolve) => {
    const report = await getReport(reportId, type, headers);
    const file = JSON.parse(report);
    if (file.code) {
      return resolve(false);
    }
    request({
      url: file.location,
      method: 'GET',
      followAllRedirects: true,
      headers: {
        'Authorization': headers.Authorization,
        'Amazon-Advertising-API-Scope': headers['Amazon-Advertising-API-Scope'],
        'Allow': 'GET, HEAD, PUT, DELETE',
      }
    }, (err, response, body) => {
      if (err) {
        return resolve(false);
      }
      const fileURL = response.request.uri.href;
      //console.log("FileURL:", fileURL);

      const r = request(fileURL);
      const file_name = url.parse(fileURL).pathname.split('/').pop();
      r.on('response', function (res) {
        res.pipe(fs.createWriteStream('./download/' + file_name));
        const gunzip = zlib.createGunzip();
        const buffer = [];
        res.pipe(gunzip);
        gunzip.on('data', function (data) {
          //    console.log("download:", data.toString())
          buffer.push(data.toString())
        }).on("end", function () {
          // Get date created
          const query = "SELECT * FROM advertising_reports.reports WHERE report_id LIKE " + "'%" + reportId + "%'";
          db.query(query, (err, result) => {
            if (err) resolve(err);
            if (result && result.length > 0) {
              const info = {
                profile: profile.accountInfo,
                country: profile.countryCode,
                type: type,
                createdAt: result[0].created_at
              };
              return resolve({
                data: buffer.join(""),
                info: info
              });
            } else {
              return resolve(false);
            }
          })
        }).on("error", function (e) {
          return resolve(false);
        })
      });
    })
  });
}