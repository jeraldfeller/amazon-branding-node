const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;


mongoose.connect('mongodb://localhost/amazon')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDb...', err));



const {Seller} = require('../model/sellers');
const {Report} = require('../model/reports');
const {Product} = require('../model/products');
const {Order} = require('../model/orders');

const requestReport = async (reportType, startDate, endDate = moment().format('YYYYMMDD')) => {
  const beforeDate = moment(startDate).subtract(1, 'days').format('YYYY-MM-DD');
  console.log(beforeDate);
  console.log('Requesting report');
  const sellers = await getSellers();
  for (let x = 0; x < sellers.length; x++) {
    let sellerObjId = sellers[x]._id;
    let sellerId = sellers[x].sellerId;
    let MWSAuthToken = sellers[x].MWSAuthToken;
    let AWSAccessKeyId = sellers[x].AWSAccessKeyId;
    let SecretKey = sellers[x].SecretKey;
    let MarketplaceId = sellers[x].MarketplaceId;
    var aws = require('amazon-mws')(AWSAccessKeyId, SecretKey);
    switch (reportType) {
      case '_GET_MERCHANT_LISTINGS_ALL_DATA_':
        var requestBody = {
          'Version': '2009-01-01',
          'Action': 'RequestReport',
          'SellerId': sellerId,
          'MWSAuthToken': MWSAuthToken,
          'ReportType': reportType
        };
        break;
      case '_GET_FLAT_FILE_ORDERS_DATA_':
        var requestBody = {
          'Version': '2009-01-01',
          'Action': 'RequestReport',
          'SellerId': sellerId,
          'MWSAuthToken': MWSAuthToken,
          'ReportType': reportType,
          'StartDate': new Date(beforeDate),
          'EndDate': new Date(startDate),
        };
        break;
    }
    aws.reports.search(requestBody, async function (error, response) {
      if (error) {
        console.log('error ', error);
        return;
      }
      console.log('Request report complete');
      await saveReport(response.ReportRequestInfo, sellerObjId);
    });
  }

};

const listFinancialEvents = async () => {
  console.log('Fetching Sellers');
  const sellers = await getSellers();
  for (let x = 0; x < sellers.length; x++) {
    let sellerObjId = sellers[x]._id;
    let sellerId = sellers[x].sellerId;
    let MWSAuthToken = sellers[x].MWSAuthToken;
    let AWSAccessKeyId = sellers[x].AWSAccessKeyId;
    let SecretKey = sellers[x].SecretKey;
    let MarketplaceId = sellers[x].MarketplaceId;
    console.log('Fetching Orders');
    const orders = await Order.find({feesIncluded: false}).and({sellerId: sellerId});
    for(let o = 0; o < orders.length; o++){
      let orderId = orders[o].orderId;
      var aws = require('amazon-mws')(AWSAccessKeyId, SecretKey);
      aws.finances.search({
        'Version': '2015-05-01',
        'Action': 'ListFinancialEvents',
        'SellerId': sellerId,
        'MWSAuthToken': MWSAuthToken,
        'AmazonOrderId': orderId
      }, async function (error, response) {
        if (error) {
          console.log('error ', error);
          return;
        }
        //console.log(response);
        let financialEvents = response.FinancialEvents;
        //console.log(financialEvents);
        let shipmentItemList = financialEvents.ShipmentEventList.ShipmentEvent.ShipmentItemList;
        let ItemFeeList = shipmentItemList.ShipmentItem.ItemFeeList;
        // console.log(shipmentItemList);
        // console.log(ItemFeeList);
        let order = await Order.find({orderId: orderId});
        for(let f = 0; f < ItemFeeList['FeeComponent'].length; f++){
          if(ItemFeeList['FeeComponent'][f].FeeType == 'Commission'){
            if(order.length > 0){
              order[0].referral = ItemFeeList['FeeComponent'][f].FeeAmount.CurrencyAmount;
            }
          }
          if(ItemFeeList['FeeComponent'][f].FeeType == 'FBAStorageFee'){
              // add FBA storage fee to orders
              if(order.length > 0){
                order[0].fbaStorageFee = ItemFeeList['FeeComponent'][f].FeeAmount.CurrencyAmount;
              }
          }
        }
        if(order.length > 0){
          order[0].feesIncluded = true;
          order[0].save();
        }
      });
    }
  }

  console.log('----------------- COMPLETE ----------------');

};

const checkRequestReport = async (startDate) => {
  console.log('Checking Report Status');
  const reports = await getReports();
  for (let x = 0; x < reports.length; x++) {
    let sellerObjId = reports[x].seller._id;
    let sellerId = reports[x].seller.sellerId;
    let MWSAuthToken = reports[x].seller.MWSAuthToken;
    let AWSAccessKeyId = reports[x].seller.AWSAccessKeyId;
    let SecretKey = reports[x].seller.SecretKey;
    let reportRequestId = reports[x].reportRequestId;
    let reportObjId = reports[x]._id;

    var aws = require('amazon-mws')(AWSAccessKeyId, SecretKey);
    aws.reports.search({
      'Version': '2009-01-01',
      'Action': 'GetReportRequestList',
      'SellerId': sellerId,
      'MWSAuthToken': MWSAuthToken,
      'ReportRequestIdList.Id.1': reportRequestId
    }, async function (error, response) {
      if (error) {
        console.log('error ', error);
        return;
      }
      console.log('Checking Request report complete');
      // if the report status is _DONE_ proceed get Report and update request status
      let requestReportStatus = response.ReportRequestInfo.ReportProcessingStatus;
      let requestReportType = response.ReportRequestInfo.ReportType;
      let generatedId = response.ReportRequestInfo.GeneratedReportId;
      console.log(response);
      if (requestReportStatus == '_DONE_') {
        // getReport
        aws.reports.search({
          'Version': '2009-01-01',
          'Action': 'GetReport',
          'SellerId': sellerId,
          'MWSAuthToken': MWSAuthToken,
          'ReportId': generatedId
        }, async function (error, response) {
          if (error) {
            console.log('error ', error);
            return;
          }

          // update report
          await Report.update({_id: reportObjId},
            {
              $set: {
                status: true,
                reportId: generatedId
              }
            }
          );
          console.log(response);
          await saveReportRequest(response, requestReportType, reports[x].seller);
        });
      } else {
        console.log(requestReportStatus);
      }

    });


  }
};

async function getReports() {
  console.log('Fetching report requests');
  return await Report
    .find({status: false})
    .select('_id reportRequestId seller');
}
async function getSellers() {
  console.log('Fetching Sellers');
  return await Seller.find();
}

async function saveReport(report, sellerObjId) {
  console.log('Saving report');
  console.log(report);
  const seller = await Seller.findById(sellerObjId);
  if (seller) {
    let reportId = (report.ReportId ? report.ReportId : null);
    const rep = new Report({
      seller: {
        _id: seller._id,
        sellerId: seller.sellerId,
        MWSAuthToken: seller.MWSAuthToken,
        AWSAccessKeyId: seller.AWSAccessKeyId,
        SecretKey: seller.SecretKey,
        Marketplace: seller.Marketplace
      },
      reportType: report.ReportType,
      reportRequestId: report.ReportRequestId,
      reportId: reportId,
      status: false
    });
    try {
      await rep.save();
      console.log(rep);
    } catch (err) {
      console.log(err);
    }
  } else {
    return;
  }
}

async function saveReportRequest(result, reportType, seller) {
  console.log('Saving Request Report');
  let data = result.data;
  switch (reportType) {
    case '_GET_MERCHANT_LISTINGS_ALL_DATA_':
      for (let x = 0; x < data.length; x++) {
        console.log(data[x]['product-id']);
        const productInfo = {
          sellerId: seller.sellerId,
          itemName: data[x]['item-name'],
          itemDescription: data[x]['item-description'],
          listingId: data[x]['listing-id'],
          sellerSku: data[x]['seller-sku'],
          price: data[x]['price'],
          quantity: data[x]['quantity'],
          openDate: new Date(data[x]['open-date']),
          imageUrl: data[x]['image-url'],
          itemIsMarketplace: data[x]['item-is-marketplace'],
          productIdType: data[x]['product-id-type'],
          zshopShipingFee: data[x]['zshop-shipping-fee'],
          itemNote: data[x]['item-node'],
          itemCondition: data[x]['item-condition'],
          zshopCategory1: data[x]['zshop-category1'],
          zshopBrowsePath: data[x]['zshop-browse-path'],
          zshopStorefrontFeature: data[x]['zshop-storefront-feature'],
          asin1: data[x]['asin1'],
          asin2: data[x]['asin2'],
          asin3: data[x]['asin3'],
          willShipInternationally: data[x]['will-ship-internationally'],
          expeditedShipping: data[x]['expedited-shipping'],
          zshopBoldface: data[x]['zshop-bold-face'],
          productId: data[x]['product-id'],
          bidForFeaturedPlacement: data[x]['bid-for-featured-placement'],
          addDelete: data[x]['add-delete'],
          pendingQuantity: data[x]['pending-quantity'],
          fulfillmentChannel: data[x]['fulfillment-channel'],
          merchantShippingGroup: data[x]['merchant-shipping-group'],
          status: data[x]['status']
        }

        let product = await Product.find({productId: data[x]['product-id']});
        console.log(product);
        if (product.length == 0) {
          let product = new Product(productInfo);
          try {
            await product.save();
            console.log(product.productId);
          } catch (err) {
            console.log(err);
          }
        } else {
          product[0].itemName = data[x]['item-name'],
            product[0].itemDescription = data[x]['item-description'],
            product[0].listingId = data[x]['listing-id'],
            product[0].sellerSku = data[x]['seller-sku'],
            product[0].price = data[x]['price'],
            product[0].quantity = data[x]['quantity'],
            product[0].openDate = new Date(data[x]['open-date']),
            product[0].imageUrl = data[x]['image-url'],
            product[0].itemIsMarketplace = data[x]['item-is-marketplace'],
            product[0].productIdType = data[x]['product-id-type'],
            product[0].zshopShipingFee = data[x]['zshop-shipping-fee'],
            product[0].itemNote = data[x]['item-node'],
            product[0].itemCondition = data[x]['item-condition'],
            product[0].zshopCategory1 = data[x]['zshop-category1'],
            product[0].zshopBrowsePath = data[x]['zshop-browse-path'],
            product[0].zshopStorefrontFeature = data[x]['zshop-storefront-feature'],
            product[0].asin1 = data[x]['asin1'],
            product[0].asin2 = data[x]['asin2'],
            product[0].asin3 = data[x]['asin3'],
            product[0].willShipInternationally = data[x]['will-ship-internationally'],
            product[0].expeditedShipping = data[x]['expedited-shipping'],
            product[0].zshopBoldface = data[x]['zshop-bold-face'],
            product[0].productId = data[x]['product-id'],
            product[0].bidForFeaturedPlacement = data[x]['bid-for-featured-placement'],
            product[0].addDelete = data[x]['add-delete'],
            product[0].pendingQuantity = data[x]['pending-quantity'],
            product[0].fulfillmentChannel = data[x]['fulfillment-channel'],
            product[0].merchantShippingGroup = data[x]['merchant-shipping-group'],
            product[0].status = data[x]['status']

          product[0].save();
        }
      }
      break;
    case '_GET_FLAT_FILE_ORDERS_DATA_':
      for (let x = 0; x < data.length; x++) {
        console.log(data[x]['order-id']);
        let orderInfo = {
          sellerId: seller.sellerId,
          orderId: data[x]['order-id'],
          orderItemId: data[x]['order-item-id'],
          purchaseDate: new Date(data[x]['purchase-date']),
          paymentsDate: new Date(data[x]['payments-date']),
          buyerEmail: data[x]['buyer-email'],
          buyerName: data[x]['buyer-name'],
          buyerPhoneNumber: data[x]['buyer-phone-number'],
          sku: data[x]['sku'],
          productName: data[x]['product-name'],
          quantityPurchased: data[x]['quantity-purchased'],
          currency: data[x]['currency'],
          itemPrice: data[x]['item-price'],
          itemTax: data[x]['item-tax'],
          shippingPrice: data[x]['shipping-price'],
          shippingTax: data[x]['shipping-tax'],
          shipServiceLevel: data[x]['ship-service-level'],
          recipientName: data[x]['recipient-name'],
          shipAddress1: data[x]['ship-address-1'],
          shipAddress2: data[x]['ship-address-2'],
          shipAddress3: data[x]['ship-address-3'],
          shipCity: data[x]['ship-city'],
          shipState: data[x]['ship-state'],
          shipPostalCode: data[x]['ship-postal-code'],
          shipCountry: data[x]['ship-counry'],
          shipPhoneNumber: data[x]['ship-phone-number'],
          deliveryStartDate: data[x]['delivery-start-date'],
          deliveryEndDate: data[x]['delivery-end-date'],
          deliveryTimeZone: data[x]['delivery-time-zone'],
          deliveryInstructions: data[x]['delivery-instructions']
        };

        let order = await Order.find({orderId: data[x]['order-id']});
        if (order.length == 0) {
          let order = new Order(orderInfo);
          try {
            await order.save();
          } catch (err) {
            console.log(err);
          }
        } else {
          order[0].orderItemId = data[x]['order-item-id'],
            order[0].purchaseDate = new Date(data[x]['purchase-date']),
            order[0].paymentsDate = new Date(data[x]['payments-date']),
            order[0].buyerEmail = data[x]['buyer-email'],
            order[0].buyerName = data[x]['buyer-name'],
            order[0].buyerPhoneNumber = data[x]['buyer-phone-number'],
            order[0].sku = data[x]['sku'],
            order[0].productName = data[x]['product-name'],
            order[0].quantityPurchased = data[x]['quantity-purchased'],
            order[0].currency = data[x]['currency'],
            order[0].itemPrice = data[x]['item-price'],
            order[0].itemTax = data[x]['item-tax'],
            order[0].shippingPrice = data[x]['shipping-price'],
            order[0].shippingTax = data[x]['shipping-tax'],
            order[0].shipServiceLevel = data[x]['ship-service-level'],
            order[0].recipientName = data[x]['recipient-name'],
            order[0].shipAddress1 = data[x]['ship-address-1'],
            order[0].shipAddress2 = data[x]['ship-address-2'],
            order[0].shipAddress3 = data[x]['ship-address-3'],
            order[0].shipCity = data[x]['ship-city'],
            order[0].shipState = data[x]['ship-state'],
            order[0].shipPostalCode = data[x]['ship-postal-code'],
            order[0].shipCountry = data[x]['ship-counry'],
            order[0].shipPhoneNumber = data[x]['ship-phone-number'],
            order[0].deliveryStartDate = data[x]['delivery-start-date'],
            order[0].deliveryEndDate = data[x]['delivery-end-date'],
            order[0].deliveryTimeZone = data[x]['delivery-time-zone'],
            order[0].deliveryInstructions = data[x]['delivery-instructions']
          order[0].save();
        }
      }
      break;
  }
  console.log('----- COMPLETE REPORT -----');
}

let requestInventoryReportCronJob = new CronJob('00 01 01 * * *', function () {
  const date = new Date();
  requestReport('_GET_MERCHANT_LISTINGS_ALL_DATA_', date);
}, null, true, 'America/Los_Angeles');

let requestOrdersReportCronJob = new CronJob('00 22 * * * *', function () {
  const date = new Date();
  requestReport('_GET_FLAT_FILE_ORDERS_DATA_', date);
}, null, true, 'America/Los_Angeles');

let checkReportRequestCronJob = new CronJob('00 */10  * * * *', function () {
  const date = new Date();
  checkRequestReport(date);
}, null, true, 'America/Los_Angeles');

let listFinancialEventsCronJob = new CronJob('00 */10  * * * *', function () {
  listFinancialEvents();
}, null, true, 'America/Los_Angeles');

requestInventoryReportCronJob.start();
requestOrdersReportCronJob.start();
checkReportRequestCronJob.start();
listFinancialEventsCronJob.start();

