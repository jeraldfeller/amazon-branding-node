const mongoose = require('mongoose');
const Report = mongoose.model('Report', new mongoose.Schema(
  {
    seller: {
      type: new mongoose.Schema({
        sellerId: {
          type: String,
          required: true,
        },
        MWSAuthToken: {
          type: String,
          required: true
        },
        AWSAccessKeyId: {
          type: String,
          required: true
        },
        SecretKey: {
          type: String,
          required: true
        },
        Marketplace: {
          type: String,
          required: true
        }
      })
    },
    reportType: {
      type: String,
      required: true,
    },
    reportRequestId: {
      type: String,
      required: true,
    },
    reportId: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
    }

  }
  )
);

exports.Report = Report;