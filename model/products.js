const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema(
  {
    sellerId: {
      type: String
    },
    itemName: {
      type: String,
    },
    itemDescription: {
      type: String,
    },
    listingId: {
      type: String,
    },
    sellerSku: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    openDate: {
      type: Date,
    },
    imageUrl: {
      type: String,
    },
    itemIsMarketplace: {
      type: String,
    },
    productIdType: {
      type: String,
    },
    zshopShipingFee: {
      type: Number,
    },
    itemNote: {
      type: String,
    },
    itemCondition: {
      type: Number,
    },
    zshopCategory1: {
      type: String,
    },
    zshopBrowsePath: {
    type: String,
    },
    zshopStorefrontFeature: {
      type: String,
    },
    asin1: {
      type: String,
    },
    asin2: {
      type: String,
    },
    asin3: {
      type: String,
    },
    willShipInternationally: {
      type: String,
    },
    expeditedShipping: {
      type: String,
    },
    zshopBoldface: {
      type: String,
    },
    productId: {
      type: String,
      unique: true
    },
    bidForFeaturedPlacement: {
      type: String,
    },
    addDelete: {
      type: String,
    },
    pendingQuantity: {
      type: String,
    },
    fulfillmentChannel: {
      type: String,
    },
    merchantShippingGroup: {
      type: String,
    },
    status: {
      type: String,
    }
  }
  )
);

exports.Product = Product;