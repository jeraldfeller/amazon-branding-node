const db = require('../helpers/database');

module.exports = (err, data, info, campaignType) => {
  return new Promise((resolve) => {
    let result = [];
    let reports = [];
    console.log(info);
    let account = info.profile.sellerStringId; // merchant id
    let country = info.country; // country

    const type = info.type;
    const createdAt = info.createdAt;

    data = JSON.parse(data);
    let query = '';
    if (campaignType.indexOf('headlineSearch') !== -1) {
      data.forEach(item => {
        query = 'UPDATE advertising_reports.hsa_keywords_report SET Impressions = ?, Clicks = ?, Cost = ?, keywordText = ?, matchType = ?, attributedConversions1d = ?, attributedConversions7d = ?, attributedConversions14d = ?, attributedConversions30d = ?, attributedConversions1dSameSKU = ?, attributedConversions7dSameSKU = ?, attributedConversions14dSameSKU = ?, attributedConversions30dSameSKU = ?, attributedUnitsOrdered1d = ?, attributedUnitsOrdered7d = ?, attributedUnitsOrdered14d = ?, attributedUnitsOrdered30d = ?, attributedSales1d = ?, attributedSales7d = ?, attributedSales14d = ?, attributedSales30d = ?, attributedSales1dSameSKU = ?, attributedSales7dSameSKU = ?, attributedSales14dSameSKU = ?, attributedSales30dSameSKU WHERE CampaignId = ? AND Account = ? AND Date = ? AND keywordText = ? AND Country = ?';
        const report = [item.impressions, item.clicks, item.cost, item.keywordText, item.matchType, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU, item.campaignId, account, createdAt, item.keywordText, country];
        if (report.length > 0) {
          db.query(query, report, (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
            } else {
              console.log('update success');
              console.log(result);
            }
          })
        } else {
          console.log("Failed to save reports");
          return false;
        }
      })
      resolve({
        status: 200,
        data: []
      })
    } else if (type.indexOf('keyword') !== -1) {
      data.forEach(item => {
        query = 'UPDATE advertising_reports.campaigns_keyword_report SET Impressions = ?, Clicks = ?, Cost = ?, keywordText = ?, attributedConversions1d = ?, attributedConversions7d = ?, attributedConversions14d = ?, attributedConversions30d = ?, attributedConversions1dSameSKU = ?, attributedConversions7dSameSKU = ?, attributedConversions14dSameSKU = ?, attributedConversions30dSameSKU = ?, attributedUnitsOrdered1d = ?, attributedUnitsOrdered7d = ?, attributedUnitsOrdered14d = ?, attributedUnitsOrdered30d = ?, attributedSales1d = ?, attributedSales7d = ?, attributedSales14d = ?, attributedSales30d = ?, attributedSales1dSameSKU = ?, attributedSales7dSameSKU = ?, attributedSales14dSameSKU = ?, attributedSales30dSameSKU WHERE CampaignId = ? AND Account = ? AND Date = ? AND Keyword = ? AND search_term = ? AND Country = ?';
        const report = [item.impressions, item.clicks, item.cost, item.keywordText, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU, item.campaignId, account, createdAt, item.keywordText, item.query, country];
        if (report.length > 0) {
          db.query(query, report, (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
            } else {
              console.log('update success');
              console.log(result);
            }
          })
        } else {
          console.log("Failed to save reports");
          return false;
        }
      })
      resolve({
        status: 200,
        data: []
      })
    } else if (type.indexOf('productAd') !== -1) {
      data.forEach(item => {
          query = 'UPDATE advertising_reports.campaigns_product_ads SET Impressions = ?, Clicks = ?, Cost = ?, attributedConversions1d = ?, attributedConversions7d = ?, attributedConversions14d = ?, attributedConversions30d = ?, attributedConversions1dSameSKU = ?, attributedConversions7dSameSKU = ?, attributedConversions14dSameSKU = ?, attributedConversions30dSameSKU = ?, attributedUnitsOrdered1d = ?, attributedUnitsOrdered7d = ?, attributedUnitsOrdered14d = ?, attributedUnitsOrdered30d = ?, attributedSales1d = ?, attributedSales7d = ?, attributedSales14d = ?, attributedSales30d = ?, attributedSales1dSameSKU = ?, attributedSales7dSameSKU = ?, attributedSales14dSameSKU = ?, attributedSales30dSameSKU = ? WHERE CampaignId = ? AND Account = ? AND asin = ? AND SKU = ? AND Date = ? AND Country = ?';
          const report = [item.impressions, item.clicks, item.cost, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU, item.campaignId, account, item.asin, item.sku, createdAt, country];
          if (report.length > 0) {
            db.query(query, report, (err, result) => {
              console.log(result);
              if (err) {
                console.log(err);
              } else {
                console.log('update success');
                console.log(result);
              }
            })
          } else {
            console.log("Failed to save reports");
            return false;
          }
      })

      resolve({
        status: 200,
        data: []
      })

    } else if (type.indexOf('campaign') !== -1) {
      data.forEach(item => {
        query = 'UPDATE advertising_reports.campaigns_product_ads SET Impressions = ?, Clicks = ?, Cost = ?, attributedConversions1d = ?, attributedConversions7d = ?, attributedConversions14d = ?, attributedConversions30d = ?, attributedConversions1dSameSKU = ?, attributedConversions7dSameSKU = ?, attributedConversions14dSameSKU = ?, attributedConversions30dSameSKU = ?, attributedUnitsOrdered1d = ?, attributedUnitsOrdered7d = ?, attributedUnitsOrdered14d = ?, attributedUnitsOrdered30d = ?, attributedSales1d = ?, attributedSales7d = ?, attributedSales14d = ?, attributedSales30d = ?, attributedSales1dSameSKU = ?, attributedSales7dSameSKU = ?, attributedSales14dSameSKU = ?, attributedSales30dSameSKU = ? WHERE CampaignId = ? AND Account = ? AND campaignName = ? AND Date = ? AND Country = ?';
        const report = [item.impressions, item.clicks, item.cost, item.attributedConversions1d, item.attributedConversions7d, item.attributedConversions14d, item.attributedConversions30d, item.attributedConversions1dSameSKU, item.attributedConversions7dSameSKU, item.attributedConversions14dSameSKU, item.attributedConversions30dSameSKU, item.attributedUnitsOrdered1d, item.attributedUnitsOrdered7d, item.attributedUnitsOrdered14d, item.attributedUnitsOrdered30d, item.attributedSales1d, item.attributedSales7d, item.attributedSales14d, item.attributedSales30d, item.attributedSales1dSameSKU, item.attributedSales7dSameSKU, item.attributedSales14dSameSKU, item.attributedSales30dSameSKU, item.campaignId, account, item.campaignName, createdAt, country];
        if (report.length > 0) {
          db.query(query, report, (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
            } else {
              console.log('update success');
              console.log(result);
            }
          })
        } else {
          console.log("Failed to save reports");
          return false;
        }
      })
      resolve({
        status: 200,
        data: []
      })
    }

  })
}

