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
    
      async function stockObj(stock){
        let stk = await fetchStock(stock);
        if(stk){
          let data = await findLike(stock);
            if(!data){
              return {
                stock: stk.stock,
                price: stk.price,
                likes: 0
              }
            } else {
              return {
                stock: stk.stock,
                price: stk.price,
                likes: 1
              }
            }
          }
      }
    
      // if one stock and no likes 
    
      
    
      if(!Array.isArray(stock) && !like){
        stockObj(stock).then((stock) => {
          res.json({stockData: stock})
        }).catch(err => console.log(err));
      }
    
    // if one stock and like
    
    if(!Array.isArray(stock) && like){
      stockObj(stock).then((stock) => {
        if(stock){
          if(stock.likes === 1){
            res.json({stockData: stock})
            console.log('like true')
          } 
          if(stock.likes === 0){
            console.log('no like')
            db.collection(ip).insertOne({name: stock.stock}, (data) => {
              if(data){
                console.log(data);
              }
            })
          }
        }
      }).catch(err => console.log(err));
    }
    
    // if two stocks and no like 
    
    if(Array.isArray(stock) && !like){
      let firstStock = stock[0];
      let lastStock = stock[1];
      
      stockObj(firstStock).then((stock1,err) => {
        if(stock1){
          let obj1 = stock1;
          
          stockObj(lastStock).then((stock2, err) => {
            if(stock2){
              let obj2 = stock2;
              console.log(obj2);
              let stockData = [
                {
                  stock: obj1.stock,
                  price: obj1.price,
                  rel_likes: relLikes(obj1, obj2)
                },
                {
                  stock: obj2.stock,
                  price: obj2.price,
                  rel_likes: relLikes(obj2, obj1)
                }
              ]
              
              res.json({stockData});
            }
          })
        }
      })
      
    }
      
    });
    
};
