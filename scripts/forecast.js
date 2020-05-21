/**
Author: Elkin Giovanni Romero Bustamante
Function: This module only deals with the forecast data, and it should be good
to add functions realted to find the forecast with lat and long as it goes**/

//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');
var $ = require("jquery");
var download=require('./DownloadAbility.js');
var math=require('mathjs');


//**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//
var dates = {highres: [], dates: []};
var values = {highres: [], max: [], mean: [], min: [], std_dev_range_lower: [], std_dev_range_upper: []};
var units;
var config = {};
var endpoint="http://0.0.0.0:8090/api/"
//** THIS FUNCTIONS RETRIEVES THE FORECAST DATA IN A GRAPH **//

module.exports= {
  graph_fr: function(reachid,htmlELement, title, width,height){
  width = (typeof width !== 'undefined') ?  width : 500;
  height = (typeof heigth !== 'undefined') ?  heigth : 500;
  title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;


  var layer_URL=endpoint +"/ForecastRecords/?reach_id="+reachid+"&return_format=json";
    $.ajax({
      type: 'GET',
      url: layer_URL,
      success: function(data) {
        console.log(data);
        var response_timeSeries = data['time_series'];
        var dates_prep = response_timeSeries['datetime'];
        var dates_prep = response_timeSeries['datetime'];
        dates_prep.forEach(function(x){
          var onlyDate = x.split('T')[0];
          dates['dates'].push(onlyDate);
        });
        values['mean'] = data['time_series']['flow'];
        console.log(values['mean']);
        console.log(Math.max(...values['mean']));
        units =data['units']['short'];
        units_name = data['units']['name'];

        var title_download = `Historical Simulation ${title}`
        var xTitle = "Dates";
        var yTitle =`${data['units']['name']} ${data['units']['short']}`;
        config = download.addConfig(xTitle, yTitle, dates['dates'], values['mean'],title_download);
    },
    complete: function() {
        var mean_forecast = {
            name: 'Forecast Mean',
            x: dates.dates,
            y: values.mean,
            mode: "lines",
            line: {
              color: 'blue',
              shape: 'spline'
            }
        };

        var data = [mean_forecast];


         var layout = {
             width:width,
             height:height,
             title:'Forecast<br>' + title,
             xaxis: {
                title: 'Date',
                autorange: true,
                showgrid: false,
                zeroline: false,
                showline: false,
             },

             yaxis: {
               title: `${units_name} ${units}`,
               autorange: true,
               showgrid: false,
               zeroline: false,
               showline: false,
             },
             //shapes: returnShapes,
         };

         //Removing any exisisting element with the same name//
         Plotly.purge(htmlELement);
         Plotly.newPlot(htmlELement, data, layout,config);
         var index = data[0].x.length-1;


         dates.highres = [], dates.dates = [];
         values.highres = [], values.max = [], values.mean = [], values.min = [], values.std_dev_range_lower = [], values.std_dev_range_upper = [];
      },
    });
  },

}
