const mongoose = require('mongoose');
const CampaignsKeywordReport = mongoose.model('Campaigns_Keyword_Report', new mongoose.Schema(
  {
    sellerId: {type: String},
    sku: {type: String},
    asin: {type: String},
    campaignId: {type: String},
    campaignName: {type: String},
    date: {type: Date},
    sellerId: {type: String},
    country: {type: String},
    keyword: {type: String},
    impressions: {type: Number},
    clicks: {type: Number},
    cost: {type: Number},
    matchType: {type: String},
    attributedConversions1d: {type: Number},
    attributedConversions7d: {type: Number},
    attributedConversions14d: {type: Number},
    attributedConversions30d: {type: Number},
    attributedConversions1dSameSKU: {type: Number},
    attributedConversions7dSameSKU: {type: Number},
    attributedConversions14dSameSKU: {type: Number},
    attributedConversions30dSameSKU: {type: Number},
    attributedUnitsOrdered1d: {type: Number},
    attributedUnitsOrdered7d: {type: Number},
    attributedUnitsOrdered14d: {type: Number},
    attributedUnitsOrdered30d: {type: Number},
    attributedSales1d: {type: Number},
    attributedSales7d: {type: Number},
    attributedSales14d: {type: Number},
    attributedSales30d: {type: Number},
    attributedSales1dSameSKU: {type: Number},
    attributedSales7dSameSKU: {type: Number},
    attributedSales14dSameSKU: {type: Number},
    attributedSales30dSameSKU: {type: Number},
    searchTerm: {type: String}
  }
  )
);

exports.CampaignsKeywordReport = CampaignsKeywordReport;