/**
Author: Elkin Giovanni Romero Bustamante
This Module helps with the return periods for the forecast, historical graphs,
**/

//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');
var $ = require("jquery");


module.exports= {
 graph_rp: function (response_timeSeries,returnPeriodsObject,data_array,checkvisible) {
   checkvisible = (typeof checkvisible !== 'undefined') ?  checkvisible : false;
   if (!checkvisible){
     checkvisible = "legendonly";
   }
   var nrp = {
     name:'2-yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_2']),
     mode: "lines",
     fill:'none',
     showlegend:false,
     hoverinfo:'name+y',
     legendgroup:'rp2',
     visible:checkvisible,
     line: {color: 'rgba(128, 255, 0, 0.4)',width: 1}
   }

   var rp2= {
     name: '2-5yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_5']),
     mode: "lines",
     fill:'tonexty',
     showlegend: true,
     hoverinfo:'skip',
     legendgroup:'rp2',
     visible:checkvisible,
     line: {color: 'yellow', width: 0}
   }
   var nrp2 = {
     name:'5-yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_5']),
     mode: "lines",
     fill:'none',
     showlegend: false,
     hoverinfo:'name+y',
     legendgroup:'rp5',
     visible:checkvisible,
     line: {color: 'rgba(253, 154, 1,.4)',width: 1}
   }
   var rp5 = {
     name: '5-10yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_10']),
     mode: "lines",
     fill:'tonexty',
     showlegend: true,
     legendgroup:'rp5',
     hoverinfo:'none',
     visible:checkvisible,
     line: {color: 'rgba(253, 154, 1, .4)', width: 0}
   }

   var nrp3 = {
     name:'10-yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_10']),
     mode: "lines",
     fill:'none',
     showlegend: false,
     hoverinfo:'name+y',
     legendgroup:'rp10',
     visible:checkvisible,
     line: {color: 'rgba(255, 56, 5, .4', width: 1}
   }

   var rp10 = {
     name: '10-25yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_25']),
     mode: "lines",
     fill:'tonexty',
     showlegend: true,
     legendgroup:'rp10',
     hoverinfo:'none',
     visible:checkvisible,
     line: {color: 'rgba(255, 56, 5, .4', width: 0}
   }

   var nrp4 = {
     name:'25-yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_25']),
     mode: "lines",
     fill:'none',
     showlegend: false,
     hoverinfo:'name+y',
     legendgroup:'rp25',
     visible:checkvisible,
     line: {color: 'rgba(255, 0, 0, .4)', width: 1}
   }

   var rp25 = {
     name: '25-50yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_50']),
     mode: "lines",
     fill:'tonexty',
     showlegend: true,
     legendgroup:'rp25',
     hoverinfo:'none',
     visible:checkvisible,
     line: {color: 'rgba(255, 0, 0, .4)', width: 0}
   }

   var nrp5 = {
     name:'50-yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_50']),
     mode: "lines",
     fill:'none',
     showlegend: false,
     hoverinfo:'name+y',
     legendgroup:'rp50',
     visible:checkvisible,
     line: {color: 'rgba(128, 0, 106, .4)', width: 1}
   }

   var rp50 = {
     name: '50-100yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_100']),
     mode: "lines",
     fill:'tonexty',
     showlegend: true,
     legendgroup:'rp50',
     hoverinfo:'none',
     visible:checkvisible,
     line: {color: 'rgba(128, 0, 106, .4)', width: 0}
   }
   var nrp6 = {
     name:'100-yr Return Period',
     x: response_timeSeries['datetime'],
     y: Array(response_timeSeries['datetime'].length).fill(returnPeriodsObject['return_period_100']),
     mode: "lines",
     fill:'none',
     showlegend: false,
     hoverinfo:'name+y',
     legendgroup:'rp50',
     visible:checkvisible,
     line: {color: 'rgba(128, 0, 106, .4)', width: 1}
   }
   data_array.push(nrp);
   data_array.push(rp2);
   data_array.push(nrp2);
   data_array.push(rp5);
   data_array.push(nrp3);
   data_array.push(rp10);
   data_array.push(nrp4);
   data_array.push(rp25);
   data_array.push(nrp5);
   data_array.push(rp50);
   data_array.push(nrp6);

 }
}
