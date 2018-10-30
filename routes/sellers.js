const express = require('express');
const route = express.Router();
const {Seller} = require('../model/sellers');


// get all seller
route.get('/', async (req, res) => {
  let result = await Seller.find();
  res.send(result);
});



// add seller
route.post('/', async (req, res) => {
  let seller = new Seller({
    sellerId: req.body.sellerId,
    MWSAuthToken: req.body.MWSAuthToken,
    AWSAccessKeyId: req.body.AWSAccessKeyId,
    SecretKey: req.body.SecretKey,
    Marketplace: req.body.Marketplace
  });
  res.send(await seller.save());
});

module.exports = route;