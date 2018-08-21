/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect    = require('chai').expect;
var data = require('../controllers/stockHandler.js');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let like  = req.query.like || false;
    
      // Array.isArray() to check if two stocks
      // like false if no like
      // if no like do not need to save ip
      
      // { _id: stock_id, name: stock_name, ips: ['ip', 'that', 'like', 'this', 'stock'] }
    
      if(!like && !Array.isArray(stock)){
        let stockData = data('goog');
        //stockData.likes = 0;
        res.json({stockData});
      }
    });
    
};
