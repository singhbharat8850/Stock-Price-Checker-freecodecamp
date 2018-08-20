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
var request = require('request');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let url = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          res.json({
            
          }) // Show the HTML for the Google homepage. 
        }
      });
    });
    
};
