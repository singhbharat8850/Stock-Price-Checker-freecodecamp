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
    
      function stockObj(stock){
        fetchStock(stock).then((data) => {
          if(data){
            let obj = {
              stock: data.symbol,
              price: data.open
            }

            findLike(stock).then((data) => {
              if(!data){
                obj.likes = 0;
                return obj;
              } else {
                obj.likes = 1;
                return obj;
              }
            })
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
      
      console.log(stockObj(firstStock));
      stockObj(firstStock).then((data) => {
        if(data){
          let obj1 = data;
          stockObj(lastStock).then((data) => {
            if(data){
              let obj2 = data;
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
