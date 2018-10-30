const express = require('express');
const route = express.Router();


route.post('/', async (req, res) => {
  res.send(req.body);
});

module.exports = route;