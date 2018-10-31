const request = require('request');
const zlib = require('zlib');
const getReport = require('./getReport');
const fs = require('fs')
const path = require('path')
const url = require('url');
const mongoose = require('mongoose');
const {AdvertisingReport} = require('../model/advertising_reports');

module.exports = function (reportId, type, headers, profile) {
  return new Promise(async (resolve) => {
    const report = await getReport(reportId, type, headers);
    const file = JSON.parse(report);
    const status = file.status;
    if(status == 'SUCCESS'){
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
        r.on('response', async function (res) {
          res.pipe(fs.createWriteStream('../download/' + file_name));
          const gunzip = zlib.createGunzip();
          const buffer = [];
          res.pipe(gunzip);
          gunzip.on('data', async function (data) {
            //    console.log("download:", data.toString())
            buffer.push(data.toString())
          }).on("end", async () => {
            // Get date created
            const result = await AdvertisingReport.find({reportId: reportId})
            if (result && result.length > 0) {
              // update status
              result[0].status = status;
              result[0].save();
              const info = {
                profile: profile.accountInfo,
                country: profile.countryCode,
                type: type,
                createdAt: result[0].dateCreated
              };
              return resolve({
                data: buffer.join(""),
                info: info
              });
            } else {
              return resolve(false);
            }
          }).on("error", function (e) {
            return resolve(false);
          })
        });
      })
    }else{
      return resolve(false);
    }
  });
}