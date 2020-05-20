/**
Author: Elkin Giovanni Romero Bustamante

This Module only exports a graph containing historical data,
it can be added with more functions if neeeded, porobably something great
will be to have the coordinates of lat long available to makeable to plot a graph.
**/

//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');
var $ = require("jquery");
var returnPeriods=require('./returnPeriods.js');


//**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//

var dates = [];
var values = [];
var units;
var returnShapes;
var endpoint="http://0.0.0.0:8090/api/";

//** THIS FUNCTIONS RETRIEVES THE HISTORICAL DATA IN A GRAPH **//
module.exports= {
  graph: function(reachid,htmlElement,title,width,height) {
    width = (typeof width !== 'undefined') ?  width : 600;
    height = (typeof heigth !== 'undefined') ?  heigth : 500;
    title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;
    var dataObject={};
    var layer_URL=endpoint +"HistoricSimulation/?reach_id="+reachid+"&return_format=json";

    $.ajax({
      type:'GET',
      url: layer_URL,
      dataType: 'json',
      contentType:'application/json',
      success: function(data) {
        console.log('we have succeed gethistorical');
        console.log(data);
        var response_timeSeries = data['time_series'];
        var dates_prep = response_timeSeries['datetime'];
        var dates_prep = response_timeSeries['datetime'];
        dates_prep.forEach(function(x){
          var onlyDate = x.split('T')[0];
          dates.push(onlyDate);
        });
        console.log(dates);
        values =response_timeSeries['flow'];
        units =data['units']['short'];

      },

      complete: function() {
        var values_object = {
            name: 'Historical Records',
            x: dates,
            y: values,
            mode: "lines",
            line: {color: 'blue'}
        };
        var rp2 = {
            name: '2-yr Return Period',
            x: [Math.min.apply(Math, values_object.x),
                Math.max.apply(Math, values_object.x)],
            y: [0],
            mode: "lines",
            line: {color: 'rgba(128, 255, 0, 0.4)'}
        };
        var rp5 = {
            name: '5-yr Return Period',
            x: [Math.min.apply(Math, values_object.x),
                Math.max.apply(Math, values_object.x)],
            y: [0],
            mode: "lines",
            line: {color: 'rgba(255, 255, 0, 0.4)'}
        };
        var rp10 = {
            name: '10-yr Return Period',
            x: [Math.min.apply(Math, values_object.x),
                Math.max.apply(Math, values_object.x)],
            y: [0],
            mode: "lines",
            line: {color: 'rgba(255, 128, 0, 0.4)'}
        };
        var rp25 = {
            name: '25-yr Return Period',
            x: [Math.min.apply(Math, values_object.x),
                Math.max.apply(Math, values_object.x)],
            y: [0],
            mode: "lines",
            line: {color: 'rgba(255, 0, 0, 0.4)'}
        };
        var rp50 = {
            name: '50-yr Return Period',
            x: [Math.min.apply(Math, values_object.x),
                Math.max.apply(Math, values_object.x)],
            y: [0],
            mode: "lines",
            line: {color: 'rgba(255, 0, 255, 0.4)'}
        };
        var rp100 = {
            name: '100-yr Return Period',
            x: [Math.min.apply(Math, values_object.x),
                Math.max.apply(Math, values_object.x)],
            y: [0],
            mode: "lines",
            line: {color: 'rgba(127, 0, 255, 0.4)'}
        };


        var data_array= [values_object,rp2,rp5,rp10,rp25,rp50,rp100]
        var layout = {
            autosize: true,
            showlegend:true,
            title: 'Historical Streamflow<br>'+title,
            width: width,
            height: height,
            xaxis: {title: 'Date',showgrid: false},
            yaxis: {title: units, range: [0, Math.max(...data_array[0].y) + Math.max(...data_array[0].y)/5],showgrid: false},

        }
        //Removing any exisisting element with the same name//

        Plotly.purge(htmlElement);
        Plotly.newPlot(htmlElement, data_array, layout);

          returnPeriods.graph_rp(reachid,htmlElement,width,height);
          dates=[]
          values = []
      }
    });
  },

}
