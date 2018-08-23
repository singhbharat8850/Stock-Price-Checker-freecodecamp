/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect    = require('chai').expect;
var request = require('request');
var fetch = require('node-fetch');

// grab symbol and price from third party api
async function fetchStock(stock){
  let url = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
  let response = await fetch(url);
  let data = await response.json();
  //console.log(data);
  if(data){
    return {
      stock: data.symbol,
      price: data.open
    }
  }
};


  

module.exports = function (app,db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let like  = req.query.like || false;
      let ip    = req.ip
      
      async function findLike(stock){
        let response = await db.collection(ip).findOne({name:stock});
        return response;
      }
    
      async function saveLike(stock){
        let response = await db.collection(ip).insertOne({name: stock});
        return response;
      }
    
      function relLikes(obj1, obj2){
        return obj1.likes - obj2.likes;
      }
    
      function sendStock(like, res){
        fetchStock(stock).then((data) => {
          if(data){
            data.like = like;
            res.json({stockData: data})
          }
        })
      }
    
      // if one stock and no likes 
    
      
    
      if(!Array.isArray(stock) && !like){
        findLike(stock).then((data) => {
          if(!data){
            sendStock(0,res);
          } else {
            sendStock(1,res);
          }
        }).catch((err) => console.log(err))
      }
    
    // if one stock and like
    
    if(!Array.isArray(stock) && like){
      findLike(stock).then((data) => {
        if(!data){
          saveLike(stock).then((data) => {
            if(data.insertedCount === 1){
              sendStock(1,res);
            }
          })
        } else {
          sendStock(1,res);
        }
      }).catch((err) => console.log(err));
    }
    
    // if two stocks and no like 
    
    if(Array.isArray(stock) && !like){
      let firstStock = stock[0];
      let lastStock = stock[1];
      
      
    }
      
    });
    
};
