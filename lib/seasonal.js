// Author: Elkin Giovanni Romero Bustamante
//
// This Module only exports a graph containing historical data,
// it can be added with more functions if neeeded, porobably something great
// will be to have the coordinates of lat long available to makeable to plot a graph.
//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');

var $ = require("jquery");

var returnPeriods = require('./returnPeriods.js');

var download = require('./DownloadAbility.js'); //**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//


const ENDPOINT = "https://tethys2.byu.edu/localsptapi/api/";
/**
* The SEASONAL object contains the functions that are related to the plots of the Seasonal average data of a reach_id of a given stream.

* @typedef {Object}
* @property {Function} graph - Retrieves a plot of the historical data of the given reach_id.
*/

module.exports = {
  /**
   * Retrieves the plot related to the Seasonal Average Data for a given reach_id of an stream.
   * In addition, the function lets customize the width, heigh, and title of the graph if needed.
   * The retrieved plots are plotted using Plotly, so a button to download data has been added to the plots
   * @param {number} reachid - reach_id of an specific stream
   * @param {string} htmlElement - It is the id of the HTML element.
   * @param {string} title - it is the title of the grah (optional).
   * @param {string} width - Especifies the width of the plot.(optional).
   * @param {string} height - Especifies the height of the plot.(optional).
   */
  graph: function (reachid, htmlElement, title, width, height) {
    width = typeof width !== 'undefined' ? width : 600;
    height = typeof heigth !== 'undefined' ? heigth : 500;
    title = typeof title !== 'undefined' ? title : 'Reach ID: ' + reachid;
    var dates = [];
    var values = [];
    var units;
    var config = {};
    var dataObject = {};
    var layer_URL = ENDPOINT + "SeasonalAverage/?reach_id=" + reachid + "&return_format=json";
    var data_array = [];
    $.ajax({
      type: 'GET',
      url: layer_URL,
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        var response_timeSeries = data['time_series'];
        dates = response_timeSeries['datetime'];
        values = response_timeSeries['flow'];
        units = data['units']['short'];
        units_name = data['units']['name'];
        var title_download = `Seasonal Average ${title}`;
        var xTitle = "Dates";
        var yTitle = `${data['units']['name']} ${data['units']['short']}`;
        config = download.addConfig(xTitle, yTitle, dates, values, title_download);
      },
      complete: function () {
        var values_object = {
          name: 'Seasonal Average',
          x: dates,
          y: values,
          mode: "lines",
          line: {
            color: 'blue'
          }
        };
        data_array.push(values_object);
        var layout = {
          autosize: true,
          showlegend: true,
          title: 'Seasonal Average<br>' + title,
          width: width,
          height: height,
          xaxis: {
            title: 'Date',
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false
          },
          yaxis: {
            title: `${units_name} ${units}`,
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false
          }
        }; //Removing any exisisting element with the same name//

        Plotly.purge(htmlElement);
        Plotly.newPlot(htmlElement, data_array, layout, config);
      }
    });
  }
};