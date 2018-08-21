/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect    = require('chai').expect;
//var stockData = require('../controllers/stockHandler.js');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let like  = req.query.like || false;
    
      // Array.isArray() to check if two stocks
      // like false if no like
      // if no like do not need to save ip
      
      // { _id: stock_id, name: stock_name, ips: ['ip', 'that', 'like', 'this', 'stock'], }
      
      console.log(stock, like);
    });
    
};
