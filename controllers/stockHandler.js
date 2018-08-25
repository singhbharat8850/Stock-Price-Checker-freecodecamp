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
  
}

// grab symbol and price from third party api

module.exports = StockHandler;