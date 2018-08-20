/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.params;
      let url = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
      console.log(stock);
    });
    
};
