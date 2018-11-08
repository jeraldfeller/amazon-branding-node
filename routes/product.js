const express = require('express');
const route = express.Router();
const moment = require('moment');
const {Product} = require('../model/products');
const {Order} = require('../model/orders');
const {CampaignsProductAds} = require('../model/campaigns_product_ads');
const {SalesReport} = require('../model/sales-report');
route.post('/', async (req, res) => {
  switch (req.body.action) {
    case 'importCosts':
      var importData = req.body.data.data;
      for (let x = 1; x < importData.length; x++) {
        if(typeof importData[x][1] != 'undefined'){
          let sku = importData[x][0].trim();
          let costs = importData[x][1].trim();
          let costsPlus = importData[x][2].trim();
          if(sku != ''){
            const product = await Product.find({sellerSku: sku});
            if(product.length > 0){
              product[0].costs = costs;
              product[0].costsPlus = costsPlus;
              product[0].save();

              console.log(product[0]);
            }
          }
        }
      }

      res.send(true);
      break;
    case 'importSales':
      const data = req.body.data.data;
      const dateNow = req.body.data.date;
      const date = moment(req.body.data.date).format('YYYY-MM-DD');
      const dateTo = moment(dateNow).add(1, 'days').format('YYYY-MM-DD');
      console.log(date, dateTo);
      let reports = await SalesReport.find([
        {
          dateImported: {
            $gte: new Date(date)
          }
        },
        {
          dateImported: {
            $lt: new Date(dateTo)
          }
        }
      ]);
      if (reports.length > 0) {
        console.log('MATCH');
        await SalesReport.remove({dateImported: date});
      }
      for (let x = 1; x < data.length; x++) {
        if (typeof data[x][3] != 'undefined') {
          let parentAsin = data[x][0].trim();
          let childAsin = data[x][1].trim();
          let title = data[x][2].trim();
          let sku = data[x][3].trim();
          let sessions = data[x][4].trim().replace(/[^\d.-]/g, '');
          let sessionPercentage = data[x][5].trim().replace(/[^\d.-]/g, '');
          let pageViews = data[x][6].trim().replace(/[^\d.-]/g, '');
          let pageViewsPercentage = data[x][7].trim().replace(/[^\d.-]/g, '');
          let buyBoxPercentage = data[x][8].trim().replace(/[^\d.-]/g, '');
          let unitsOrdered = data[x][9].trim().replace(/[^\d.-]/g, '');
          let uniteSessionPercentage = data[x][10].trim().replace(/[^\d.-]/g, '');
          let orderedProductSales = data[x][11].trim().replace(/[^\d.-]/g, '');
          let totalOrderItems = data[x][12].trim().replace(/[^\d.-]/g, '');
          if (sku != '') {
            const salesReport = new SalesReport({
              parentAsin: parentAsin,
              childAsin: childAsin,
              title: title,
              sku: sku,
              sessions: sessions,
              sessionPercentage: sessionPercentage,
              pageViews: pageViews,
              pageViewsPercentage: pageViewsPercentage,
              buyBoxPercentage: buyBoxPercentage,
              unitsOrdered: unitsOrdered,
              uniteSessionPercentage: uniteSessionPercentage,
              orderedProductSales: orderedProductSales,
              totalOrderItems: totalOrderItems,
              dateImported: date
            });
            try {
              await salesReport.save();
              res.send(true);
            } catch (err) {
              res.send(false);
              console.log(err);
            }
          }
        }
      }


      break;
    case 'updateCost':
      const prod = await Product.find({sellerId: req.body.profile.seller, sellerSku: req.body.data.sku})
      if (prod.length > 0) {
        if (req.body.data.action == 'cost') {
          prod[0].costs = req.body.data.cost;
        } else if (req.body.data.action == 'costPlus') {
          prod[0].costsPlus = req.body.data.cost;
        }
        prod[0].save();
        res.send(prod[0]);
      } else {
        res.send(false);
      }
      break;
    case 'productList':
      console.log(req.body.profile);
      let products = await Product.find({sellerId: req.body.profile.seller});
      res.send(products);
      break;
    case 'summary':
      let skus = req.body.data.skus;
      let skusObj = [];
      let skusObjForProduct = [];
      for (let i = 0; i < skus.length; i++) {
        skusObj.push({sku: skus[i]});
        skusObjForProduct.push({sellerSku: skus[i]});
      }
      let dateRange = req.body.data.dateRange;

      let dateRangeObj = enumerateDaysBetweenDates(dateRange[0], dateRange[1]);
      let chartDateRange = dateRangeObj.chartDateRange;
      let chartDateObjData = dateRangeObj.dateObj;
      let chartValueData = [];

      let chartImpressionsDateObjData = enumerateDaysBetweenDates(dateRange[0], dateRange[1]).dateObj;
      let chartImpressionsValueData = [];

      let chartClicksDateObjData = enumerateDaysBetweenDates(dateRange[0], dateRange[1]).dateObj;
      let chartClicksValueData = [];

      let chartUnitsOrderedDateObjData = enumerateDaysBetweenDates(dateRange[0], dateRange[1]).dateObj;
      let chartUnitsOrderedValueData = [];

      let chartProductsOrderedDateObjData = enumerateDaysBetweenDates(dateRange[0], dateRange[1]).dateObj;
      let chartProductsOrderedValueData = [];

      let orders = [];
      if(skus.length > 0){
        orders = await Order
          .aggregate([
              {
                $match: {
                  $or: skusObj
                }
              },
              {
                $match: {
                  $and: [
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
                  ]
                }
              }
            ]
          );
      }


      // products
      let product = [];
      if (skusObjForProduct.length > 0) {
        product = await Product.aggregate([
          {
            $match: {
              $or: skusObjForProduct
            }
          }
        ]);
      }
      let sales = 0;
      let unitsSold = 0;
      let referral = 0;
      let fbaFee = 0;
      let fbaStorageFee = 0;
      let price = 0;

      let costsPlus = 0;
      let costs = 0;
      console.log(product.length);
      for (let p = 0; p < product.length; p++) {

        referral = referral + parseFloat(product[p].referral);
        fbaFee = fbaFee + parseFloat(product[p].fbaFees);
        price = price + parseFloat(product[p].price);
        costsPlus = costsPlus + parseFloat(product[p].costsPlus);
        costs = costs + parseFloat(product[p].costs);
      }

      console.log('----');
      console.log(referral, price, costsPlus, costs);

      // orders
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
      let cpa = [];
      if(skus.length > 0){
        cpa = await CampaignsProductAds
          .aggregate([
              {
                $match: {
                  $or: skusObj
                }
              },
              {
                $match: {
                  $and: [
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
                  ]
                }
              }
            ]
          );
      }


      let impressions = 0;
      let clicks = 0;
      let cost = 0;
      let costPerClick = 0;
      let clickTruRate = 0;
      let roas = 0;


      let totalStorageFee = 0;
      for (let c = 0; c < cpa.length; c++) {
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

      costPerClick = (clicks != 0 ? cost / clicks : 0);
      clickTruRate = (clicks != 0 ? (clicks / impressions) * 100 : 0);
      let acos = (unitsSold != 0 ? adCostTotal / (unitsSold * price) : 0);

      roas = sales / adCostTotal;

      let revenue = price * unitsSold;
      let totalProfit = revenue - (parseFloat(fbaFee) + parseFloat(referral) + parseFloat(costsPlus)) * unitsSold - totalStorageFee - adCostTotal;
      let profitPerUnit = (unitsSold != 0 ? totalProfit / unitsSold : 0);
      let profitMargin = (revenue != 0 ? totalProfit / revenue : 0);

      let fbaFeesPrice = fbaFee / price;
      let costPlusPrice = costsPlus / price;


      // sales

      let salesReport = [];
      if(skus.length > 0){
        salesReport = await SalesReport
          .aggregate([
              {
                $match: {
                  $or: skusObj
                }
              },
              {
                $match: {
                  $and: [
                    {
                      dateImported: {
                        $gte: new Date(dateRange[0])
                      }
                    },
                    {
                      dateImported: {
                        $lte: new Date(dateRange[1])
                      }
                    }
                  ]
                }
              }
            ]
          );
      }


      let sessions = 0;
      let sessionPercentage = 0;
      let pageViews = 0;
      let pageViewsPercentage = 0;
      let unitsOrdered = 0;
      let orderedProductSales = 0;
      let totalOrderItems = 0;

      let unitSessionPercentage = 0;

      let buyBoxPercentageArray = [];
      let buyBoxPercentage = 0;

      if (salesReport.length > 0) {
        for (let s = 0; s < salesReport.length; s++) {
          sessions = parseInt(salesReport[s]['sessions']) + sessions;
          pageViews = parseInt(salesReport[s]['pageViews']) + pageViews;
          unitsOrdered = parseInt(salesReport[s]['unitsOrdered']) + unitsOrdered;
          orderedProductSales = parseFloat(salesReport[s]['orderedProductSales']) + orderedProductSales;
          totalOrderItems = parseInt(salesReport[s]['totalOrderItems']) + totalOrderItems;
          buyBoxPercentageArray.push(salesReport[s]['buyBoxPercentage']);
          if (!chartUnitsOrderedDateObjData[getYmd(salesReport[s].dateImported)]) {
            chartUnitsOrderedDateObjData[getYmd(salesReport[s].dateImported)] = 0;
          }
          chartUnitsOrderedDateObjData[getYmd(salesReport[s].dateImported)] = (parseInt(chartUnitsOrderedDateObjData[getYmd(salesReport[s].dateImported)]) + parseInt(salesReport[s]['unitsOrdered']));

          if (!chartProductsOrderedDateObjData[getYmd(salesReport[s].dateImported)]) {
            chartProductsOrderedDateObjData[getYmd(salesReport[s].dateImported)] = 0;
          }
          chartProductsOrderedDateObjData[getYmd(salesReport[s].dateImported)] = (parseInt(chartProductsOrderedDateObjData[getYmd(salesReport[s].dateImported)]) + parseFloat(salesReport[s]['orderedProductSales']));
        }

        for (let y in chartUnitsOrderedDateObjData) {
          chartUnitsOrderedValueData.push(chartUnitsOrderedDateObjData[y]);
        }

        for (let y in chartProductsOrderedDateObjData) {
          chartProductsOrderedValueData.push(chartProductsOrderedDateObjData[y]);
        }

        if (buyBoxPercentageArray.length > 0) {
          buyBoxPercentage = buyBoxPercentageArray.reduce(getSum);
        }


        unitSessionPercentage = (totalOrderItems / sessions) * 100;

        // get sum of session of a given period

        const allSkuSalesReport = await SalesReport.aggregate([
          {
            $match: {
              $and: [{
                dateImported: {
                  $gte: new Date(dateRange[0]),
                  $lte: new Date(dateRange[1])
                }
              }]
            }
          },
          {
            $group: {
              _id: null,
              session: {
                $sum: "$sessions"
              },
              pageViews: {
                $sum: "$pageViews"
              }
            }
          }
        ]);

        sessionPercentage = (sessions / allSkuSalesReport[0]['session']) * 100;
        pageViewsPercentage = (pageViews / allSkuSalesReport[0]['pageViews']) * 100;
      }
      if (skus.length > 1) {
        var sku = 'Multiple Selected';
        var asin = 'Multiple Selected';
        var isMultiple = true;
      } else {
        if (skus.length == 0) {
          var sku = '';
          var asin = '';
          var isMultiple = false;
        }else{
          var sku = product[0].sellerSku
          var asin = product[0].asin1
          var isMultiple = false;
        }

      }

      if(skus.length > 0){
        var response = {
          "SKU": sku,
          "asin": asin,
          "Units_Ordered": unitsSold,
          "Units_Ordered_Sales": unitsOrdered,
          "price": price,
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
          "salesChart": {
            "unitsOrdered": {
              "dateRange": chartDateRange,
              "value": chartUnitsOrderedValueData
            },
            "productsOrdered": {
              "dateRange": chartDateRange,
              "value": chartProductsOrderedValueData
            }
          },
          "Fba_Fees": fbaFee.toFixed(2),
          "Referral": referral.toFixed(2),
          "Pick_And_Pack": "",
          "Costs": costs.toFixed(2),
          "Costs_plus": costsPlus.toFixed(2),
          "Total_Advertising_Cost": adCostTotal.toFixed(2),
          "ACOS": acos.toFixed(2) + "%",
          "Total_Storage": fbaStorageFee.toFixed(2),
          "FBA_Fees_Price": fbaFeesPrice.toFixed(2),
          "Costs_Price": costPlusPrice.toFixed(2),
          "Revenue": revenue.toFixed(2),
          "Total_Profit": totalProfit.toFixed(2),
          "Profit_Margin": profitMargin.toFixed(2),
          "Profit_Per_Unit": profitPerUnit.toFixed(2),
          "Sessions": sessions,
          "Session_Percentage": sessionPercentage.toFixed(2),
          "Page_Views": pageViews,
          "Page_Views_Percentage": pageViewsPercentage,
          "Buy_Box_Percentage": buyBoxPercentage,
          "Unit_Session_Percentage": unitSessionPercentage,
          "Ordered_Product_Sales": sales.toFixed(2),
          "Ordered_Product_Sales_Report": orderedProductSales.toFixed(2),
          "Total_Order_Items": totalOrderItems,
          "Impressions": impressions,
          "Clicks": clicks,
          "ROAS": roas.toFixed(2),
          "Spend": cost.toFixed(2),
          "Click_Thru_Rate": clickTruRate.toFixed(2),
          "Cost_Per_Click": costPerClick.toFixed(2),
          "isMultiple": isMultiple
        };

      }else{
        var response = [];
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

function getSum(total, num) {
  return total + num;
}
module.exports = route;