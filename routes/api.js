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

async function fetchStock(stock, like){
  let url = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
  let response = await fetch(url);
  let data = await response.json();
  //console.log(data);
  if(data){
    let stockData = {
      stock: data.symbol,
      price: data.open,
      likes: like
    }
    
    return stockData;
  }
};
  

module.exports = function (app,db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let url   = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
      let stock = req.query.stock;
      let like  = req.query.like || false;
      let ip    = req.ip
      
      // one stock without like --- see any previous like exixts in database
      
      if(!Array.isArray(stock) && !like){
         db.collection(ip).findOne({name: stock})
         .then((data) => {
           if(!data){
             
           }
         })
      }
      
      // one stock with like --- save like api to database 
      // two stocks without like --- save like and show rel_likes
      // two stocks with like --- no database access needed, rel_likes always 0;
    
//       if(!Array.isArray(stock) && !like){
//         oneStockWithoutLike(stock);
//       } else if(!Array.isArray(stock) && like){
//         oneStockWithLike(stock)
//       }
    
//       function likeExists(stock){
        
//         db.collection(ip).findOne({name: stock})
//         .then((data) => {
          
//             console.log(data);
          
//         })
//         .catch(err => console.log(err))
//       }
    
//       function oneStockWithoutLike(stock){
//         likeExists(stock);
        
//       }
      
//       function oneStockWithLike(stock){
        
//       }
      
    
      // Array.isArray() to check if two stocks
      // like false if no like
      // if no like do not need to save ip
      
      // collection as ip name, save liked stocks
    
      // if(!like && !Array.isArray(stock)){
      //   let stockData = data('goog');
      //   //stockData.likes = 0;
      //   res.json({stockData});
      // }
    });
    
};
