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

async function fetchStock(stock){
  let url = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
  let response = await fetch(url);
  let data = await response.json();
  //console.log(data);
  if(data){
    return data;
  }
};
  

module.exports = function (app,db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let like  = req.query.like || false;
    
      // one stock without like --- no database access needed
      // one stock with like --- save like api to database 
      // two stocks without like --- save like and show rel_likes
      // two stocks with like --- no database access needed, rel_likes always 0;
    
      if(!Array.isArray(stock) && !like){
        oneStockWithoutLike(stock);
      } 
    
      function oneStockWithoutLike(stock){
        fetchStock(stock)
          .then((data) =>{
            let stockData = { stock: data.symbol, price: data.open, likes: 0}
            res.json({stockData});
        })
          .catch((err) => {console.log(err)})
      }
      
      function oneStockWithLike(stock){
        db.collection('stock-likes').find({name: stock})
      }
      
    
      // Array.isArray() to check if two stocks
      // like false if no like
      // if no like do not need to save ip
      
      // { _id: stock_id, name: stock_name, ips: ['ip', 'that', 'like', 'this', 'stock'] }
    
      // if(!like && !Array.isArray(stock)){
      //   let stockData = data('goog');
      //   //stockData.likes = 0;
      //   res.json({stockData});
      // }
    });
    
};
