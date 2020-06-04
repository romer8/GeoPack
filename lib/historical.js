/**
Author: Elkin Giovanni Romero Bustamante

This Module only exports a graph containing historical data,
it can be added with more functions if neeeded, porobably something great
will be to have the coordinates of lat long available to makeable to plot a graph.
**/
//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');

var $ = require("jquery");

var returnPeriods = require('./returnPeriods.js');

var download = require('./DownloadAbility.js'); //**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//
// var returnShapes;


var config = {};
const ENDPOINT = "https://tethys2.byu.edu/localsptapi/api/"; //** THIS FUNCTIONS RETRIEVES THE HISTORICAL DATA IN A GRAPH **//

module.exports = {
  graph: function (reachid, htmlElement, title, rp, width, height) {
    width = typeof width !== 'undefined' ? width : 600;
    height = typeof heigth !== 'undefined' ? heigth : 500;
    title = typeof title !== 'undefined' ? title : 'Reach ID: ' + reachid;
    rp = typeof rp !== 'undefined' ? rp : false;
    var dataObject = {};
    var layer_URL = ENDPOINT + "HistoricSimulation/?reach_id=" + reachid + "&return_format=json";
    var data_array = [];
    var returnPeriodsObject = {};
    var dates = [];
    var values = [];
    var units;
    $.ajax({
      type: 'GET',
      url: layer_URL,
      dataType: 'json',
      contentType: 'application/json',
      success: function (resp) {
        var response_timeSeries = resp['time_series'];
        dates = response_timeSeries['datetime'];
        values = response_timeSeries['flow'];
        units = resp['units']['short'];
        units_name = resp['units']['name'];
        var title_download = `Historical Simulation ${title}`;
        var xTitle = "Dates";
        var yTitle = `${resp['units']['name']} ${resp['units']['short']}`;
        config = download.addConfig(xTitle, yTitle, dates, values, title_download);
        var values_object = {
          name: 'Historical Records',
          x: dates,
          y: values,
          mode: "lines",
          line: {
            color: 'blue'
          }
        };
        data_array.push(values_object);
        var layer_URL_rp = ENDPOINT + "ReturnPeriods/?reach_id=" + reachid + "&return_format=json";
        $.ajax({
          type: 'GET',
          assync: true,
          url: layer_URL_rp,
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            returnPeriodsObject = data['return_periods'];

            if (rp) {
              returnPeriods.graph_rp(response_timeSeries, returnPeriodsObject, data_array, true);
            }

            var layout = {
              autosize: true,
              showlegend: true,
              title: 'Historical Streamflow<br>' + title,
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
            };
            Plotly.purge(htmlElement);
            Plotly.newPlot(htmlElement, data_array, layout, config);
          }
        });
      }
    });
  }
};