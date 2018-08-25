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

console.log(StockHandler.stock('goog'));

module.exports = function (app,db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let like  = req.query.like || false;
      let ip    = req.ip
      
      console.log(StockHandler.fetchStock(stock));
      // Convert single stock to uppercase
      
      if(!Array.isArray(stock)){
        stock = (req.query.stock).toUpperCase();
      }
      
      // check if stock is saved in database. If save under IP document then it already added as a like
    
      async function findLike(stock){
        let response = await db.collection(ip).findOne({name:stock});
        return response;
      }
    
      // save liked stock to IP documet
    
      async function saveLike(stock){
        let response = await db.collection(ip).insertOne({name: stock});
        return response;
      }
    
      // difference between likes in two stocks 
    
      function relLikes(obj1, obj2){
        return obj1.likes - obj2.likes;
      }
    
      // check database and return stock object with likes number
    
      async function stockObj(stock){
        let stkObj = await StockHandler.fetchStock(stock);
        if(stkObj){
          let data = await findLike(stock);
            if(data){
              return {
                stock: stkObj.stock,
                price: stkObj.price,
                likes: 1
              }
            } else {
              return {
                stock: stkObj.stock,
                price: stkObj.price,
                likes: 0
              }
            }
          }
      }
    
      // check liked stock. if already added return if not add like and return. 
    
      async function findAndUpdate(stock){
        let obj = await stockObj(stock);
        if(obj.likes === 1){
          return obj;
        }
        if(obj.likes === 0){
          saveLike(obj.stock).then((data) => {
            if(data.insertedCount === 1){
              obj.likes = 1;
              return obj;
            }
          });
        }
      }
    
      // if one stock and no likes 
    
      if(!Array.isArray(stock) && !like){
        stockObj(stock).then((stkObj) => {
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
      
      stockObj(firstStock).then((stkObj1,err) => {
        if(stkObj1){
          let obj1 = stkObj1;
          stockObj(lastStock).then((stkObj2, err) => {
            if(stkObj2){
              let obj2 = stkObj2;
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
