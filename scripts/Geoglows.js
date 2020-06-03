/*
This is the wrapper for the four modules related to the API:
    --Forecast
    --Historical
    --Seasonal Average
    --Return Periods(this one is also included inside each one of this ones).
*/

/*
  Exporting the Necessary Modules
*/

var forecast = require('./forecast.js');
var historical=require('./historical.js');
var seasonal = require('./seasonal.js')

// var seasonal=require('./scripts/getSeasonal.js');

/*
  Final wrapper for the function containing the other
  modules
*/
// if(typeof exports != "undefined"){
  module.exports= {
    forecast:forecast,
    historical: historical,
    seasonal:seasonal
  }
