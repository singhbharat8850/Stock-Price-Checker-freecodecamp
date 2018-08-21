/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect    = require('chai').expect;
var stockData = require('../controllers/stockHandler');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      // let stock = req.query.stock;
      // let like  = JSON.parse(req.query.like) || false;
      
      console.log('log');
    });
    
};
