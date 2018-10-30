class Amazon{
  constructor(sellerId, MWSAuthToken, AWSAccessKeyId, SecretKey, MarketplaceId){
    this.sellerId = sellerId.trim();
    this.MWSAuthToken = MWSAuthToken.trim();
    this.AWSAccessKeyId = AWSAccessKeyId.trim();
    this.SecretKey = SecretKey.trim();
    this.MarketplaceId = MarketplaceId.trim();
  }

  listOrderItem(){
    return new Promise((resolve, reject) => {
      let sellerId = this.sellerId;
      let MWSAuthToken = this.MWSAuthToken;
      let AWSAccessKeyId = this.AWSAccessKeyId;
      let SecretKey = this.SecretKey;
      let MarketplaceId = this.MarketplaceId;
      var aws = require('amazon-mws')(AWSAccessKeyId,SecretKey);
      aws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': sellerId,
        'MWSAuthToken': MWSAuthToken,
        'AWSAccessKeyId': AWSAccessKeyId,
        'MarketplaceId.Id.1': MarketplaceId,
        'CreatedBefore': new Date('2018-10-21'),
        'CreatedAfter': new Date('2018-10-20')
      }, function (error, response) {
        if (error) {
          reject(error);
        }
        let orders = response.Orders;
        resolve(orders);
      });
    });
  }
}

exports.Amazon = Amazon;
