
const db = require('../helpers/database');

module.exports = (err, data, info, campaignType) => {
  return new Promise((resolve) => {
    let reports = [];
    console.log(info);
    let account = info.profile.sellerStringId; // merchant id
    let country = info.country; // country

    const type = info.type;
    const createdAt = info.createdAt;
    console.log('TYPE: ' + campaignType);
    console.log('Sub Type: ', type);
    data = JSON.parse(data);
    let query = '';
    if (campaignType == 'headlineSearch') {
      console.log('MATCH: ' + campaignType);
      query = 'INSERT INTO advertising_reports.hsa_keywords_report (campaignId,Date,Account,Country,campaignName,adGroupId,adGroupName,campaignBudget,campaignStatus,Impressions,Clicks,Cost,keywordText,matchType,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU) VALUES ?';
      data.forEach(item => {
        if ((item.impressions!=0) || (item.clicks!=0) || (item.cost!=0) || (item.attributedConversions1d!=0) || (item.attributedConversions7d!= 0) || (item.attributedConversions14d != 0)|| (item.attributedConversions30d!=0) || (item.attributedConversions1dSameSKU != 0) || (item.attributedConversions7dSameSKU != 0) || (item.attributedConversions14dSameSKU != 0) || (item.attributedConversions30dSameSKU != 0) || (item.attributedUnitsOrdered1d != 0) || (item.attributedUnitsOrdered7d != 0) || (item.attributedUnitsOrdered14d != 0) || (item.attributedUnitsOrdered30d != 0) || (item.attributedSales1d != 0) || (item.attributedSales7d != 0) || (item.attributedSales14d != 0)|| (item.attributedSales30d != 0) || (item.attributedSales1dSameSKU != 0) || (item.attributedSales7dSameSKU != 0) || (item.attributedSales14dSameSKU != 0) || (item.attributedSales30dSameSKU != 0 )) {
          const report = [item.campaignId, createdAt, account, country, item.campaignName, item.adGroupId, item.adGroupName, item.campaignBudget, item.campaignStatus, item.impressions, item.clicks, item.cost, item.keywordText, item.matchType, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU];
          reports.push(report);
        }
      })
    } else if (type.indexOf('keyword') !== -1) {
      query = 'INSERT INTO advertising_reports.campaigns_keyword_report (CampaignId, campaignName, Date,Account,Country,Keyword,Impressions,Clicks,Cost,matchType,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU,search_term) VALUES ?';
      data.forEach(item => {
        if ((item.impressions!=0) || (item.clicks!=0) || (item.cost!=0) || (item.attributedConversions1d!=0) || (item.attributedConversions7d!= 0) || (item.attributedConversions14d != 0)|| (item.attributedConversions30d!=0) || (item.attributedConversions1dSameSKU != 0) || (item.attributedConversions7dSameSKU != 0) || (item.attributedConversions14dSameSKU != 0) || (item.attributedConversions30dSameSKU != 0) || (item.attributedUnitsOrdered1d != 0) || (item.attributedUnitsOrdered7d != 0) || (item.attributedUnitsOrdered14d != 0) || (item.attributedUnitsOrdered30d != 0) || (item.attributedSales1d != 0) || (item.attributedSales7d != 0) || (item.attributedSales14d != 0)|| (item.attributedSales30d != 0) || (item.attributedSales1dSameSKU != 0) || (item.attributedSales7dSameSKU != 0) || (item.attributedSales14dSameSKU != 0) || (item.attributedSales30dSameSKU != 0 )) {
          const report = [item.campaignId, item.campaignName, createdAt, account, country, item.keywordText, item.impressions, item.clicks, item.cost, item.matchType, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU,item.query];
          reports.push(report);
        }
      })
    } else if (type.indexOf('productAd') !== -1) {
      query = 'INSERT INTO advertising_reports.campaigns_product_ads (CampaignId, CampaignName, adGroupId,adGroupName, Date,Account, Country, asin, SKU,Currency,Impressions,Clicks,Cost,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU) VALUES ?';
      data.forEach(item => {
        if ((item.impressions!=0) || (item.clicks!=0) || (item.cost!=0) || (item.attributedConversions1d!=0) || (item.attributedConversions7d!= 0) || (item.attributedConversions14d != 0)|| (item.attributedConversions30d!=0) || (item.attributedConversions1dSameSKU != 0) || (item.attributedConversions7dSameSKU != 0) || (item.attributedConversions14dSameSKU != 0) || (item.attributedConversions30dSameSKU != 0) || (item.attributedUnitsOrdered1d != 0) || (item.attributedUnitsOrdered7d != 0) || (item.attributedUnitsOrdered14d != 0) || (item.attributedUnitsOrdered30d != 0) || (item.attributedSales1d != 0) || (item.attributedSales7d != 0) || (item.attributedSales14d != 0)|| (item.attributedSales30d != 0) || (item.attributedSales1dSameSKU != 0) || (item.attributedSales7dSameSKU != 0) || (item.attributedSales14dSameSKU != 0) || (item.attributedSales30dSameSKU != 0 ))
        {
          const report = [item.campaignId, item.campaignName, item.adGroupId, item.adGroupName, createdAt, account, country, item.asin, item.sku, item.currency, item.impressions, item.clicks, item.cost,item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU];
          reports.push(report);
        }

      })

    } else if (type.indexOf('campaign') !== -1) {
      query = 'INSERT INTO advertising_reports.campaign_sp_reports (bidPlus, Date, Account, Country, campaignName,campaignId,campaignStatus,campaignBudget,Impressions,Clicks,Cost,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU) VALUES ?';
      data.forEach(item => {
        if ((item.impressions!=0) || (item.clicks!=0) || (item.cost!=0) || (item.attributedConversions1d!=0) || (item.attributedConversions7d!= 0) || (item.attributedConversions14d != 0)|| (item.attributedConversions30d!=0) || (item.attributedConversions1dSameSKU != 0) || (item.attributedConversions7dSameSKU != 0) || (item.attributedConversions14dSameSKU != 0) || (item.attributedConversions30dSameSKU != 0) || (item.attributedUnitsOrdered1d != 0) || (item.attributedUnitsOrdered7d != 0) || (item.attributedUnitsOrdered14d != 0) || (item.attributedUnitsOrdered30d != 0) || (item.attributedSales1d != 0) || (item.attributedSales7d != 0) || (item.attributedSales14d != 0)|| (item.attributedSales30d != 0) || (item.attributedSales1dSameSKU != 0) || (item.attributedSales7dSameSKU != 0) || (item.attributedSales14dSameSKU != 0) || (item.attributedSales30dSameSKU != 0 )) {
          const report = [item.bidPlus, createdAt, account, country, item.campaignName, item.campaignId, item.campaignStatus, item.campaignBudget, item.impressions, item.clicks, item.cost, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU];
          reports.push(report);
        }
      })
    }
    if (reports.length > 0) {
      db.query(query, [reports], (err, result) => {
        if (err) {
          console.log(err);
          resolve(err);
        }
        resolve({
          status: 200,
          data: result
        })
      })
    } else {
      console.log("Failed to save reports");
      resolve(false);
    }
  })
}

 