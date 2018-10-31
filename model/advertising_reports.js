const mongoose = require('mongoose');
const AdvertisingReport = mongoose.model('Advertising_Report', new mongoose.Schema(
  {
    sellerId: {
      type: String
    },
    reportId:{
      type: String
    },
    campaignType:{
      type: String
    },
    recordType:{
      type: String
    },
    status:{
      type: String
    },
    statusDetails:{
      type: String
    },
    dateCreated:{
      type: String
    }
  }
));

exports.AdvertisingReport = AdvertisingReport;