const moment = require('moment');
const getProfiles = require('../controller/getProfiles');
const createReport = require('../controller/createReport');
const downloadReport = require('../controller/downloadReport');
const saveReport = require('../controller/saveReport');
const config = require('../config')
const express = require('express');
const mongoose = require('mongoose');
const auth = require('../helpers/auth');
const CronJob = require('cron').CronJob;

const {AdvertisingReport} = require('../model/advertising_reports');


mongoose.connect('mongodb://localhost/amazon')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDb...', err));

const getResult = function (query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    })
  })
}

console.log('START');

const makeReports = async (startDate, endDate = moment().format('YYYYMMDD')) => {
  const realDate = moment(startDate).subtract(1, 'days').format('YYYY-MM-DD');
  console.log(realDate);
  const result = await AdvertisingReport.find({dateCreated: realDate});
  if (result.length > 0) {
    console.log("Already exists for that day");
    return true;
  }
  let date = moment(startDate).subtract(1, 'days').format('YYYYMMDD');
  const tokens = await auth();
  if (tokens && typeof tokens === 'object') {
    const headers = await getHeaders(tokens);
    const data = await getProfiles(headers);
    console.log(data);
    const profiles = JSON.parse(data);

    // for the meantime only productAds reports
    const recordTypes = ['productAds'];
    //const recordTypes = ['productAds', 'keywords', 'campaigns'];
    const campaignTypes = ['sponsoredProducts', 'headlineSearch'];

    for (let campaign = 0; campaign < campaignTypes.length; campaign++) {
      for (let record = 0; record < recordTypes.length; record++) {
        const campaignType = campaignTypes[campaign];
        const recordType = recordTypes[record];
        // For Headline Search Ads
        if (campaignType.indexOf("headlineSearch") !== -1 && recordType.indexOf("keyword") == -1) {
          continue;
        }

        let metrics = config.metricsForKeywords; // For keyword

        if (recordType.indexOf("productAd") !== -1) { // For productAds
          metrics = config.metricsForAds;
        }

        if (recordType.indexOf("campaign") !== -1) { // For campaigns
          metrics = config.metricsForCampaigns;
        }

        if (campaignType.indexOf('headline') !== -1) {
          metrics = config.metricsForHSAKeywords;
        }

        let reportParam = {
          campaignType: campaignType,
          segment: "query",
          reportDate: date,
          metrics: metrics
        };

        if (recordType.indexOf("productAd") !== -1 || recordType.indexOf("campaign") !== -1 || campaignType.indexOf('headline') !== -1) {
          delete reportParam.segment;
        } else {
          reportParam.segment = 'query';
        }
        for (let i = 0; i < profiles.length; i++) {
          let sellerId = profiles[i].accountInfo.sellerStringId
          headers['Amazon-Advertising-API-Scope'] = profiles[i].profileId;
          const res = await createReport(reportParam, recordType, headers);
          console.log(res);
          if (res) {
            if (typeof res === 'object' && res.reportId) {
              let report = new AdvertisingReport({
                sellerId: sellerId,
                reportId: res.reportId,
                campaignType: campaignType,
                recordType: res.recordType,
                status: res.status,
                statusDetails: res.statusDetails,
                dateCreated: realDate
              });
              try {
                await report.save();
                console.log(report);
              } catch (err) {
                console.log(err);
              }
            }
          } else {
            console.log("Did not create report!");
          }
        }


      }
    }
  }
  console.log('----------------- COMPLETE ----------------');
}


function getHeaders(tokens) {
  return new Promise((resolve, reject) => {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `${config.token_type} ${tokens.access_token}`,
      'Amazon-Advertising-API-Scope': '',
    };
    resolve(headers);
  })
}

async function getReports(today) {
  const realDate = moment(today).subtract(1, 'days').format('YYYY-MM-DD');
  console.log('Real Date: ' + realDate);
  const tokens = await auth();
  if (tokens && typeof tokens === 'object') {
    const headers = await getHeaders(tokens);
    const data = await getProfiles(headers);
    const profiles = JSON.parse(data);
    const result = await AdvertisingReport.find({dateCreated: realDate});
    // const result = await AdvertisingReport.find({dateCreated: realDate}).and({status: {$ne: 'SUCCESS'}});
    if (result.length == 0) {
      console.log("No available reports!");
    }
    for (let i = 0; i < result.length; i++) {
      const row = result[i];
      if (row && row.reportId) {
        for (let j = 0; j < profiles.length; j++) {
          headers['Amazon-Advertising-API-Scope'] = profiles[j].profileId;
          const reportInfo = await downloadReport(row.reportId, row.recordType, headers, profiles[j]);
          if (reportInfo) {
            await saveReport(null, reportInfo.data, reportInfo.info, row.campaignType)
          }

        }
      }
    }


  }

  console.log('----------------- COMPLETE ----------------');

}
let generateReportCronJob = new CronJob('00 04 * * * *', function () {
  const date = new Date();
  makeReports(date);
}, null, true, 'Europe/Rome');

let saveReportCronJob = new CronJob('00 37 * * * *', function () {
  const date = new Date();
  getReports(date);
}, null, true, 'Europe/Rome');

generateReportCronJob.start();
saveReportCronJob.start();