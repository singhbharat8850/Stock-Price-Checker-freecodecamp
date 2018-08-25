/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect     = require('chai').expect;
var StockHandler = require('../controllers/stockHandler.js');


module.exports = function (app,db) {
  
  var stockHandler = new StockHandler();
  
  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let like  = req.query.like || false;
      let ip    = req.ip
      
      
      // Convert single stock to uppercase
      
      if(!Array.isArray(stock)){
        stock = (req.query.stock).toUpperCase();
      }
    
      // check liked stock. if already added return if not add like and return. 
    
      async function findAndUpdate(stock){
        let obj = await stockHandler.stockObj(stock,db,ip);
        if(obj.likes === 1){
          return obj;
        }
        if(obj.likes === 0){
          stockHandler.saveLike(obj.stock,db,ip).then((data) => {
            if(data.insertedCount === 1){
              obj.likes = 1;
              return obj;
            }
          });
        }
      }
    
      // if one stock and no likes 
    
      if(!Array.isArray(stock) && !like){
        stockHandler.stockObj(stock,db,ip).then((stkObj) => {
          res.json({stockData: stkObj})
        }).catch(err => console.log(err));
      }
    
    // if one stock and like
    
    if(!Array.isArray(stock) && like){
      findAndUpdate(stock).then((stkObj) => {
        if(stkObj){
          res.json({stockData: stkObj})
        }
      }).catch(err => console.log(err));
    }
    
    // if two stocks and no like 
    
    if(Array.isArray(stock) && !like){
      let firstStock = stock[0].toUpperCase();
      let lastStock = stock[1].toUpperCase();
      
      stockHandler.stockObj(firstStock,db,ip).then((stkObj1,err) => {
        if(stkObj1){
          let obj1 = stkObj1;
          stockHandler.stockObj(lastStock,db,ip).then((stkObj2, err) => {
            if(stkObj2){
              let obj2 = stkObj2;
              let stockData = [
                {
                  stock: obj1.stock,
                  price: obj1.price,
                  rel_likes: stockHandler.relLikes(obj1, obj2)
                },
                {
                  stock: obj2.stock,
                  price: obj2.price,
                  rel_likes: stockHandler.relLikes(obj2, obj1)
                }
              ]
              
              res.json({stockData});
            }
          })
        }
      })
      
    }
    
    // if two stocks and like
    
    if(Array.isArray(stock) && like){
      let firstStock = stock[0].toUpperCase();
      let lastStock = stock[1].toUpperCase();
      findAndUpdate(firstStock).then((obj1) => {
        if(obj1){
          findAndUpdate(lastStock).then((obj2) => {
            if(obj2){
              let stockData = [
                {
                  stock: obj1.stock,
                  price: obj1.price,
                  rel_likes: stockHandler.relLikes(obj1, obj2)
                },
                {
                  stock: obj2.stock,
                  price: obj2.price,
                  rel_likes: stockHandler.relLikes(obj2, obj1)
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
