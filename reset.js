const {Product} = require('./model/products');
const {Order} = require('./model/orders');
const {Report} = require('./model/reports);
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/amazon')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDb...', err));


async function  init(){
  await Product.remove({});
  await Order.remove({});
  await Report.remove({});
  console.log('complete');
}


init();