var fetch      = require('node-fetch');

function StockHandler(){

  this.fetchStock = async function(stock){
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
  
  // check if stock is saved in database. If save under IP document then it already added as a like
    
  this.findLike = async function(stock,db,ip){
    let response = await db.collection(ip).findOne({name:stock});
    return response;
  }
  
  // save liked stock to IP documet
    
  this.saveLike = async function(stock,db,ip){
    let response = await db.collection(ip).insertOne({name: stock});
    return response;
  }
  
  // difference between likes in two stocks 
    
  this.relLikes = function(obj1, obj2){
    return obj1.likes - obj2.likes;
  }
}

// grab symbol and price from third party api

module.exports = StockHandler;