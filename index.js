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
var forecast=require('./scripts/getForecast.js');
var historical=require('./scripts/getHistorical.js');
var seasonal=require('./scripts/getSeasonal.js');

/*
  Final wrapper for the function containing the other
  modules
*/
// if(typeof exports != "undefined"){
  module.exports= {
    FORECAST: forecast,
    HISTORICAL: historical,
    SEASONAL: seasonal
  }
//   exports.FORECAST = forecast;
//   exports.HISTORICAL = historical;
//   exports.SEASONAL = seasonal;
// }
// else{
//   const FORECAST = forecast;
//   const HISTORICAL = historical;
//   const SEASONAL = seasonal;
// }
