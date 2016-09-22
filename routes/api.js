var express = require('express');
var router = express.Router();

var Products = require('../models/products');
Products.methods(['get', 'put', 'post', 'delete']);
Products.register(router, '/product');

module.exports = router;