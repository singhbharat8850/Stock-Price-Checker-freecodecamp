var request = require('request');

module.exports = function(stock){
  let url = "https://api.iextrading.com/1.0/stock/"+stock+"/quote";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      let stockData = {
        stock: data.symbol,
        price: data.open
      }

      return stockData
    }
  });
}