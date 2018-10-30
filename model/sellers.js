const mongoose = require('mongoose');
const Seller = mongoose.model('Seller', new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true
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
  }
  )
);

exports.Seller = Seller;