const mongoose = require('mongoose');
const Order = mongoose.model('Order', new mongoose.Schema(
  {
    sellerId: {
      type: String
    },
    orderId: {
      type: String
    },
    orderItemId: {
      type: String
    },
    purchaseDate: {
      type: Date
    },
    paymentsDate: {
      type: Date
    },
    buyerEmail: {
      type: String
    },
    buyerName: {
      type: String
    },
    buyerPhoneNumber: {
      type: String
    },
    sku: {
      type: String
    },
    productName: {
      type: String
    },
    quantityPurchased: {
      type: String
    },
    currency: {
      type: String
    },
    itemPrice: {
      type: String
    },
    itemTax: {
      type: String
    },
    shippingPrice: {
      type: String
    },
    shippingTax: {
      type: String
    },
    shipServiceLevel: {
      type: String
    },
    recipientName: {
      type: String
    },
    shipAddress1: {
      type: String
    },
    shipAddress2: {
      type: String
    },
    shipAddress3: {
      type: String
    },
    shipCity: {
      type: String
    },
    shipState: {
      type: String
    },
    shipPostalCode: {
      type: String
    },
    shipCountry: {
      type: String
    },
    shipPhoneNumber: {
      type: String
    },
    deliveryStartDate: {
      type: String
    },
    deliveryEndDate: {
      type: String
    },
    deliveryTimeZone: {
      type: String
    },
    deliveryInstructions: {
      type: String
    },
    feesIncluded: {
      type: Boolean,
      default: false
    },
    fbaStorageFee:{
      type: Number,
      default: 0
    }
  }
  )
);

exports.Order = Order;