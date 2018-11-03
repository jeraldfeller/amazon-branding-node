const express = require('express');
const route = express.Router();
const moment = require('moment');
const {Product} = require('../model/products');
const {Order} = require('../model/orders');
const {CampaignsProductAds} = require('../model/campaigns_product_ads');
route.post('/', async (req, res) => {
  switch (req.body.action) {
    case 'updateCost':
      const prod = await Product.find({sellerId: req.body.profile.seller, sellerSku: req.body.data.sku})
      if(prod.length > 0){
        if(req.body.data.action == 'cost'){
          prod[0].costs = req.body.data.cost;
        }else if(req.body.data.action == 'costPlus'){
          prod[0].costsPlus = req.body.data.cost;
        }
        prod[0].save();
        res.send(prod[0]);
      }else{
        res.send(false);
      }
      break;
    case 'productList':
      console.log(req.body.profile);
      let products = await Product.find({sellerId: req.body.profile.seller});
      res.send(products);
      break;
    case 'summary':
      let sku = req.body.data.sku;
      let dateRange = req.body.data.dateRange;
      let dateRangeObj = enumerateDaysBetweenDates(dateRange[0], dateRange[1]);
      let chartDateRange = dateRangeObj.chartDateRange;
      let chartDateObjData = dateRangeObj.dateObj;
      let chartValueData = [];

      let chartImpressionsDateObjData = enumerateDaysBetweenDates(dateRange[0], dateRange[1]).dateObj;
      let chartImpressionsValueData = [];

      let chartClicksDateObjData = enumerateDaysBetweenDates(dateRange[0], dateRange[1]).dateObj;
      let chartClicksValueData = [];

      let orders = await Order
        .find({sku: sku})
        .and([
          {
            paymentsDate: {
              $gte: new Date(dateRange[0])
            }
          },
          {
            paymentsDate: {
              $lte: new Date(dateRange[1])
            }
          }
        ]);
      let product = await Product
        .find({sellerSku: sku});
      let sales = 0;
      let unitsSold = 0;
      let referral = product[0].referral;
      let fbaFee = product[0].fbaFees;
      let fbaStorageFee = 0;
      for (let x = 0; x < orders.length; x++) {
        chartDateObjData[getYmd(orders[x].paymentsDate)] = (chartDateObjData[getYmd(orders[x].paymentsDate)] + parseFloat(orders[x].itemPrice));
        unitsSold = (unitsSold + parseInt(orders[x].quantityPurchased));
        sales = (sales + parseFloat(orders[x].itemPrice));
        fbaStorageFee = (parseFloat(orders[x].fbaStorageFee) + fbaStorageFee);
      }

      for (let y in chartDateObjData) {
        chartValueData.push(chartDateObjData[y]);
      }

      // get Ad Spent
      let adCostTotal = 0;
      let cpa = await CampaignsProductAds
        .find({sku: sku})
        .and([
          {
            date: {
              $gte: new Date(dateRange[0])
            }
          },
          {
            date: {
              $lte: new Date(dateRange[1])
            }
          }
        ]);

      let impressions = 0;
      let clicks = 0;
      let cost = 0;
      let costPerClick = 0;
      let clickTruRate = 0;
      let roas = 0;



      let totalStorageFee = 0;
      for(let c = 0; c < cpa.length; c++){
        chartClicksDateObjData[getYmd(cpa[c].date)] = (chartClicksDateObjData[getYmd(cpa[c].date)] + parseFloat(cpa[c].clicks));
        chartImpressionsDateObjData[getYmd(cpa[c].date)] = (chartImpressionsDateObjData[getYmd(cpa[c].date)] + parseFloat(cpa[c].impressions));
        impressions = (parseInt(cpa[c].impressions) + impressions);
        clicks = (parseInt(cpa[c].clicks) + clicks);
        cost = (parseFloat(cpa[c].cost) + cost);
        adCostTotal = (parseFloat(cpa[c].cost) + adCostTotal);

      }

      for (let y in chartImpressionsDateObjData) {
        chartImpressionsValueData.push(chartImpressionsDateObjData[y]);
      }

      for (let y in chartClicksDateObjData) {
        chartClicksValueData.push(chartClicksDateObjData[y]);
      }

      costPerClick = (clicks != 0 ? cost/clicks : 0);
      clickTruRate = (clicks != 0 ? (clicks / impressions) * 100 : 0);
      let acos = (unitsSold != 0 ? adCostTotal/(unitsSold * product[0].price) : 0);

      roas = sales / adCostTotal;

      let revenue = product[0].price * unitsSold;
      let totalProfit = revenue - (fbaFee + referral + product[0].costsPlus) * unitsSold - totalStorageFee - adCostTotal;
      let profitPerUnit = (unitsSold != 0 ? totalProfit/unitsSold : 0);
      let profitMargin = (revenue != 0 ? totalProfit/revenue : 0);

      let fbaFeesPrice = fbaFee/product[0].price;
      let costPlusPrice = product[0].costsPlus/product[0].price;



      let response = {
        "SKU": sku,
        "asin": product[0].asin1,
        "Units_Ordered": unitsSold,
        "price": product[0].price,
        "chart": {
          "dateRange": chartDateRange,
          "value": chartValueData
        },
        "adsChart": {
          "impressions": {
            "dateRange": chartDateRange,
            "value": chartImpressionsValueData
          },
          "clicks": {
            "dateRange": chartDateRange,
            "value": chartClicksValueData
          }
        },
        "Fba_Fees": fbaFee,
        "Referral": referral,
        "Pick_And_Pack": "",
        "Costs": product[0].costs.toFixed(2),
        "Costs_plus": product[0].costsPlus.toFixed(2),
        "Total_Advertising_Cost": adCostTotal,
        "ACOS": acos+"%",
        "Total_Storage": fbaStorageFee.toFixed(2),
        "FBA_Fees_Price": fbaFeesPrice.toFixed(2),
        "Costs_Price": costPlusPrice.toFixed(2),
        "Revenue": revenue.toFixed(2),
        "Total_Profit": totalProfit.toFixed(2),
        "Profit_Margin": profitMargin.toFixed(2),
        "Profit_Per_Unit": profitPerUnit.toFixed(2),
        "Sessions": "16,087",
        "Session_Percentage": "8.7",
        "Page Views": "21,137",
        "Page_Views_Percentage": "8.9",
        "Buy_Box_Percentage": "100",
        "Unit_Session_Percentage": "43.8",
        "Ordered_Product_Sales": sales.toFixed(2),
        "Total_Order_Items": "5,075",
        "Impressions": impressions,
        "Clicks": clicks,
        "ROAS": roas,
        "Spend": cost.toFixed(2),
        "Click_Thru_Rate": clickTruRate.toFixed(2),
        "Cost_Per_Click": costPerClick.toFixed(2),
      }
      res.send(response);
      break;
  }

});

function enumerateDaysBetweenDates(startDate, endDate) {
  var dates = {};
  var chartDateRange = [];
  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(endDate).startOf('day');
  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    //console.log(currDate.clone().toDate());
    let dateObj = currDate.clone().toDate();
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let ymd = year + '-' + month + '-' + day;
    dates[ymd] = 0;
    chartDateRange.push(ymd);
  }
  return {dateObj: dates, chartDateRange: chartDateRange};
}

function getYmd(date) {
  let dateObj = date;
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  let ymd = year + '-' + month + '-' + day;
//  console.log(ymd);
  return ymd;
}
module.exports = route;