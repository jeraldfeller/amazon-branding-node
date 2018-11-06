const mongoose = require('mongoose');
const SalesReport = mongoose.model('Sales_Report', new mongoose.Schema(
  {
    parentAsin: {
      type: String
    },
    childAsin: {
      type: String
    },
    Title: {
      type: String
    },
    sku: {
      type: String
    },
    sessions: {
      type: Number
    },
    sessionPercentage: {
      type: Number
    },
    pageViews: {
      type: Number
    },
    pageViewsPercentage: {
      type: Number
    },
    buyBoxPercentage: {
      type: Number
    },
    unitsOrdered: {
      type: Number
    },
    uniteSessionPercentage: {
      type: Number
    },
    orderedProductSales: {
      type: Number
    },
    totalOrderItems: {
      type: Number
    },
    dateImported: {
      type: Date
    }
  }
));

exports.SalesReport = SalesReport;