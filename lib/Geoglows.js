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

const HISTORICAL = require('./historical.js');

const SEASONAL = require('./seasonal.js');
/*
  Final wrapper for the function containing the other
  modules
*/

/**
 * The GEOGLOWS object contains the functions that retrieve plots for the forecast, historical, seasonal average of a reach_id of a given stream.
 * Therefore, it contains three Properties: Forecast, Historical, and Seasonal.
 * In order to invoke the GEOGLOWS object, you can do it in two ways: using the CDN in the HTML or installing it via NPM.
 *<pre>
 * The CDN for the use of the package is:
 *</pre>
 *<pre>
 *https://unpkg.com/geoglows@2.0.2/dist/geoglows.min.js
 *</pre>
 * If the CDN link is going to be used it is necesarry to use the following structure: GEOGLOWS.forecast, GEOGLOWS.historical, GEOGLOWS.seasonal. After, the methods for
 * each one of the different objects can be used. For example, GEOGLOWS.forecast.graph_fr() will call the function graph_fr that will retrieve the forecast records.
 *<pre>
 * The NPM command to install the package is
 *</pre>
 *<pre>
 * npm i geoglows
 *</pre>
 * If the NPM isntallation is going to be use then a simple require will work.
 * <pre>
 * var foo = require("geoglows");
 * foo.GEOGLOWS.forecast.graph_fr();
 *</pre>
 */


module.exports = {
  forecast: FORECAST,
  historical: HISTORICAL,
  seasonal: SEASONAL
};