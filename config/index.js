const db = require('./db');

module.exports = {
    host_env: 'ec2-18-216-253-6.us-east-2.compute.amazonaws.com',
    token_url: 'https://api.amazon.com/auth/o2/token',
    us_ad_url: 'https://advertising-api.amazon.com',
    ad_url: 'https://advertising-api.amazon.com',
    access_token: '',
    metricsForAds: 'campaignId,campaignName,adGroupId,adGroupName,sku,currency,asin,impressions,clicks,cost,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU',
    metricsForKeywords: 'campaignId,campaignName,keywordText,matchType,attributedConversions1d,attributedConversions1dSameSKU,impressions,clicks,cost,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU',
    metricsForCampaigns: 'bidPlus,campaignName,campaignId,campaignStatus,campaignBudget,impressions,clicks,cost,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU',   
    metricsForHSAKeywords: 'campaignId,campaignName,adGroupId,adGroupName,campaignBudget,campaignStatus,impressions,clicks,cost,keywordText,matchType,attributedConversions1d,attributedConversions7d,attributedConversions14d,attributedConversions30d,attributedConversions1dSameSKU,attributedConversions7dSameSKU,attributedConversions14dSameSKU,attributedConversions30dSameSKU,attributedUnitsOrdered1d,attributedUnitsOrdered7d,attributedUnitsOrdered14d,attributedUnitsOrdered30d,attributedSales1d,attributedSales7d,attributedSales14d,attributedSales30d,attributedSales1dSameSKU,attributedSales7dSameSKU,attributedSales14dSameSKU,attributedSales30dSameSKU',
    // The type of entity for which the report should be generated. This must be one of: campaigns, adGroups, keywords, productAds, or asins
    reportTypes: [
        'productAds', 'keywords', 'adGroups', 'campaigns'
    ],
    reportTypeForAds: 'productAds',
    reportTypeForKeywords: 'keywords',
    // The type of campaign for which performance data should be generated. Must be: sponsoredProducts or headlineSearch
    campaignType : 'sponsoredProducts', // headlineSearch
    campaignTypes: [
        'sponsoredProducts','headlineSearch'
    ],
    redirect_uri: 'https://',
    host : '',
    client_id : 'amzn1.application-oa2-client.14737b16402848ae9b6f6adcf848f723',
    client_secret : '19ca73b712102763e8a11df3fa08864c0d400f287e6ac46af79064211c58019e',
    refresh_token: 'Atzr|IwEBIGiRGefx2BNYSIePGXSnnA1KkBuJfY3LAdl9AV8j2BPXWoOArNPR1EZCsJtb8aEwTBycwKbk5_7yt4mlKoNUSKHp6i5hXzPd4cd4_1M2j7UElhFtkt2jI8cvmsq6P0iNCRN8aIlbxCNZ4FihSkjtUiTLoeZMmuIjMhZrQAywEtdm3gyolcgUlRXx0WP0vEm-SaU4yNXqJe5dc6KiTb32IFIFHEnBOwt6ruaWEsE-kZe0UugdI0rDEqj9h4L4iR5nnAhq6dI9tVB5gSUD1TcM8NF8p4gOtFtOEDVCsCJrt7QV8M5xr6sumiSzhsRbXYMyF_ws6VCuptvGNHwpmnW7fpNMWHNzbkC-GrJTLqrH5Po_Im-LgrQxWPj7fKgRnLWmecYxFWWQNb_9pqocq4sDirzdOJeKuHWtFFq4JaCFecbe8aZ_wYHs6hTdtBFZCu2G1EpA0Z7e_IyNtMlWAIj8YSWBO7nbWJ7IXkQicPBjtn6pvp0jUnfjmPomkZ3SQaHfNBs40cw7NxAb2OzBSfCD2dQT0aVocmooaOMJfVn5wUQdYCU2-yro86e0KTVeHfygvPQom-7Qp-8XPxPKeOQX-NvO',
    token_type: 'bearer',
    db: db
}
