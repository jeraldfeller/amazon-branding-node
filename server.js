const moment = require('moment');
const getProfiles = require('./controller/getProfiles');
const createReport = require('./controller/createReport');
const downloadReport = require('./controller/downloadReport');
const saveReport = require('./controller/saveReport');
const config = require('./config')
const auth = require('./helpers/auth');
const CronJob = require('cron').CronJob;
const db = require('./helpers/database');

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
  let query = `SELECT * FROM advertising_reports.reports WHERE created_at LIKE '${realDate}%'`;
  const result = await getResult(query);
  if (result.length > 0) {
    console.log("Already exists for that day");
    return true;
  }
  let date = moment(startDate).subtract(14, 'days').format('YYYYMMDD');
  const tokens = await auth();
  if (tokens && typeof tokens === 'object') {
    const headers = await getHeaders(tokens);
    const data = await getProfiles(headers)

    const profiles = JSON.parse(data);
    const recordTypes = ['productAds', 'keywords', 'campaigns'];
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
          headers['Amazon-Advertising-API-Scope'] = profiles[i].profileId;
          const res = await createReport(reportParam, recordType, headers);
          console.log(res);
          if (res) {
            if (typeof res === 'object' && res.reportId) {
              let query = "INSERT INTO advertising_reports.reports (report_id, campaign_type,record_type, status, status_details, created_at) VALUES (";
              query += "'" + res.reportId + "','" + campaignType + "','" + res.recordType + "','" + res.status + "','" + res.statusDetails + "','" + date + "')";
              const result = await saveReportInfo(query);
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

function saveReportInfo(query) {
  return new Promise((resolve) => {
    db.query(query, (err, result) => {
      if (err) throw err;
      resolve(result)
    })
  })
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
  const realDate = moment(today).subtract(14, 'days').format('YYYY-MM-DD');
  console.log('Real Date: ' + realDate);

  const tokens = await auth();
  if (tokens && typeof tokens === 'object') {
    const headers = await getHeaders(tokens);
    const data = await getProfiles(headers);
    const profiles = JSON.parse(data);
    const query = `SELECT * FROM advertising_reports.reports WHERE created_at LIKE '${realDate}%'`;
    db.query(query, async (err, result) => {
      if (err) {
        throw new Error(err);
      }

      if (result.length == 0) {
        console.log("No available reports!");
      }

      for (let i = 0; i < result.length; i++) {
        const row = result[i];
        if (row && row.report_id) {
          for (let j = 0; j < profiles.length; j++) {
            headers['Amazon-Advertising-API-Scope'] = profiles[j].profileId;
            const reportInfo = await downloadReport(row.report_id, row.record_type, headers, profiles[j]);
            if (reportInfo) {
              await saveReport(null, reportInfo.data, reportInfo.info, row.campaign_type)
            }

          }
        }
      }

    })
  }

  console.log('----------------- COMPLETE ----------------');

}
let generateReportCronJob = new CronJob('00 * * * * *', function () {
  const date = new Date();
  makeReports(date);
}, null, true, 'Europe/Rome');

let saveReportCronJob = new CronJob('02 00 03 * * *', function () {
  const date = new Date();
  getReports(date);
}, null, true, 'Europe/Rome');

generateReportCronJob.start();
