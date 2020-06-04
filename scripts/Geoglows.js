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

const FORECAST = require('./forecast.js');
const HISTORICAL=require('./historical.js');
const SEASONAL = require('./seasonal.js')

// const seasonal=require('./scripts/getSeasonal.js');

/*
  Final wrapper for the function containing the other
  modules
*/
  module.exports= {
    forecast:FORECAST,
    historical: HISTORICAL,
    seasonal:SEASONAL
  }
