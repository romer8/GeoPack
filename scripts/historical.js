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
var download=require('./DownloadAbility.js');


//**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//

var dates = [];
var values = [];
var units;
// var returnShapes;
var config = {};
var endpoint="http://0.0.0.0:8090/api/";

//** THIS FUNCTIONS RETRIEVES THE HISTORICAL DATA IN A GRAPH **//
module.exports= {
  graph: function(reachid,htmlElement,title,rp,width,height) {
    width = (typeof width !== 'undefined') ?  width : 600;
    height = (typeof heigth !== 'undefined') ?  heigth : 500;
    title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;
    rp = (typeof rp !== 'undefined') ?  rp : false;
    var dataObject={};
    var layer_URL=endpoint +"HistoricSimulation/?reach_id="+reachid+"&return_format=json";
    var data_array=[];

    $.ajax({
      type:'GET',
      url: layer_URL,
      dataType: 'json',
      contentType:'application/json',
      success: function(data) {
        // console.log('we have succeed gethistorical');
        // console.log(data);
        var response_timeSeries = data['time_series'];
        dates = response_timeSeries['datetime'];
        values =response_timeSeries['flow'];
        units =data['units']['short'];
        units_name = data['units']['name'];
        var title_download = `Historical Simulation ${title}`
        var xTitle = "Dates";
        var yTitle =`${data['units']['name']} ${data['units']['short']}`;
        config = download.addConfig(xTitle, yTitle, dates, values,title_download);
      },

      complete: function() {

        var values_object = {
            name: 'Historical Records',
            x: dates,
            y: values,
            mode: "lines",
            line: {color: 'blue'}
        }
        data_array.push(values_object);

        if(rp){
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

          data_array.push(rp2);
          data_array.push(rp5);
          data_array.push(rp10);
          data_array.push(rp25);
          data_array.push(rp50);
          data_array.push(rp100);

        }
        var layout = {
            autosize: true,
            showlegend:true,
            title: 'Historical Streamflow<br>'+title,
            width: width,
            height: height,
            xaxis: {title: 'Date',
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
            }

        }


        //Removing any exisisting element with the same name//

        Plotly.purge(htmlElement);
        Plotly.newPlot(htmlElement, data_array, layout, config);
        if(rp){
          returnPeriods.graph_rp(reachid,htmlElement,width,height);

        }
        dates=[];
        values = [];
        config = {};
      }
    });
  },

}
