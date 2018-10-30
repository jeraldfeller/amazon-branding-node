const express = require('express');
const app = express();
const product = require('./routes/product');
const sellers = require('./routes/sellers');
const config = require('./config/index');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/amazon')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDb...', err));


app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api/product', product);
app.use('/api/sellers', sellers);

//PORT
const port =4000;
app.listen(port, () => console.log(`Listening on port ${port}....'`));