const express = require('express');
const mongoose = require('mongoose');
const {CampaignsProductAds} = require('../model/campaigns_product_ads');
module.exports = (err, data, info, campaignType) => {
  return new Promise(async (resolve) => {
    let reports = [];
    console.log(info);
    let sellerId = info.profile.sellerStringId; // merchant id
    let country = info.country; // country

    const type = info.type;
    const createdAt = info.createdAt;
    console.log(info);
    console.log('TYPE: ' + campaignType);
    console.log('Sub Type: ', type);
    data = JSON.parse(data);
    let query = '';
    if (type.indexOf('productAd') !== -1) {
      data.forEach(async item => {
        if ((item.impressions != 0) || (item.clicks != 0) || (item.cost != 0) || (item.attributedConversions1d != 0) || (item.attributedConversions7d != 0) || (item.attributedConversions14d != 0) || (item.attributedConversions30d != 0) || (item.attributedConversions1dSameSKU != 0) || (item.attributedConversions7dSameSKU != 0) || (item.attributedConversions14dSameSKU != 0) || (item.attributedConversions30dSameSKU != 0) || (item.attributedUnitsOrdered1d != 0) || (item.attributedUnitsOrdered7d != 0) || (item.attributedUnitsOrdered14d != 0) || (item.attributedUnitsOrdered30d != 0) || (item.attributedSales1d != 0) || (item.attributedSales7d != 0) || (item.attributedSales14d != 0) || (item.attributedSales30d != 0) || (item.attributedSales1dSameSKU != 0) || (item.attributedSales7dSameSKU != 0) || (item.attributedSales14dSameSKU != 0) || (item.attributedSales30dSameSKU != 0 )) {
          let cpa = new CampaignsProductAds({
            sellerId: sellerId,
            sku: item.sku,
            asin: item.asin,
            campaignId: item.campaignId,
            campaignName: item.campaignName,
            adGroupId: item.adGroupId,
            date: createdAt,
            sellerId: sellerId,
            country: country,
            currency: item.currency,
            impressions: item.impressions,
            clicks: item.clicks,
            cost: item.cost,
            attributedConversions1d: item.attributedConversions1d,
            attributedConversions7d: item.attributedConversions7d,
            attributedConversions14d: item.attributedConversions14d,
            attributedConversions30d: item.attributedConversions30d,
            attributedConversions1dSameSKU: item.attributedConversions1dSameSKU,
            attributedConversions7dSameSKU: item.attributedConversions7dSameSKU,
            attributedConversions14dSameSKU: item.attributedConversions14dSameSKU,
            attributedConversions30dSameSKU: item.attributedConversions30dSameSKU,
            attributedUnitsOrdered1d: item.attributedUnitsOrdered1d,
            attributedUnitsOrdered7d: item.attributedUnitsOrdered7d,
            attributedUnitsOrdered14d: item.attributedUnitsOrdered14d,
            attributedUnitsOrdered30d: item.attributedUnitsOrdered30d,
            attributedSales1d: item.attributedSales1d,
            attributedSales7d: item.attributedSales7d,
            attributedSales14d: item.attributedSales14d,
            attributedSales30d: item.attributedSales30d,
            attributedSales1dSameSKU: item.attributedSales1dSameSKU,
            attributedSales7dSameSKU: item.attributedSales7dSameSKU,
            attributedSales14dSameSKU: item.attributedSales14dSameSKU,
            attributedSales30dSameSKU: item.attributedSales30dSameSKU,
          });

          try {
            await cpa.save();
          } catch (err) {
            console.log(err);
          }
          resolve(false);
        }
      })
    }else{
      resolve(false);
    }
  })
}

 