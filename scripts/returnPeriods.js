/**
Author: Elkin Giovanni Romero Bustamante
This Module helps with the return periods for the forecast, historical graphs,
**/

//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');
var $ = require("jquery");

//**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//
var returnShapes;
var endpoint="http://0.0.0.0:8090/api/";


module.exports= {
 graph: function (reachid,htmlELement,width, height) {
 // var layer_URL="https://tethys2.byu.edu/localsptapi/api/ReturnPeriods/?reach_id="+reachid+"&return_format=csv";
 var layer_URL=endpoint+"ReturnPeriods/?reach_id="+reachid+"&return_format=json";
 console.log("inside getreturnperiods");
   $.ajax({
     type:'GET',
     assync: true,
     url: layer_URL,
     dataType: 'json',
     contentType:'application/json',
     success: function (data) {
       console.log(data);
       var returnPeriodsObject = data['return_periods'];
       var startDate = data['startdate'].split('T')[0];
       var endDate = data['enddate'].split('T')[0];
       var band_alt_max = -9999
       var rp2 = returnPeriodsObject['return_period_2'];
       var rp5 = returnPeriodsObject['return_period_5'];
       var rp10 = returnPeriodsObject['return_period_10'];
       var rp25 = returnPeriodsObject['return_period_25'];
       var rp50 = returnPeriodsObject['return_period_50'];
       var rp100 = returnPeriodsObject['return_period_100'];
       console.log(rp100);
       console.log(startDate);
       console.log(endDate);
       var shapes = [
               // return 2 band
               {
                   type: 'rect',
                   layer: 'below',
                   xref: 'x',
                   yref: 'y',
                   x0: startDate,
                   y0: rp2,
                   x1: endDate,
                   y1: rp5,
                   line: {width:1},
                   fillcolor: 'rgba(128, 255, 0, 0.4)',
               },
               // RETURN PERIOD 5 BAND
               {
                   type: 'rect',
                   layer: 'below',
                   xref: 'x',
                   yref: 'y',
                   x0: startDate,
                   y0: rp5,
                   x1: endDate,
                   y1: rp10,
                   line: {width:1},
                   fillcolor: 'rgba(255, 255, 0, 0.4)'
               },
               // return 10 band
               {
                   type: 'rect',
                   layer: 'below',
                   xref: 'x',
                   yref: 'y',
                   x0: startDate,
                   y0: rp10,
                   x1: endDate,
                   y1: rp25,
                   line: {width: 1},
                   fillcolor: 'rgba(255, 128, 0, 0.4)'
               },
               // return 25 band
               {
                   type: 'rect',
                   layer: 'below',
                   xref: 'x',
                   yref: 'y',
                   x0: startDate,
                   y0: rp25,
                   x1: endDate,
                   y1: rp50,
                   line: {width: 1},
                   fillcolor: 'rgba(255, 0, 0, 0.4)'
               },
               // return 50 band
               {
                   type: 'rect',
                   layer: 'below',
                   xref: 'x',
                   yref: 'y',
                   x0: startDate,
                   y0: rp50,
                   x1: endDate,
                   y1: rp100,
                   line: {width: 1},
                   fillcolor: 'rgba(255, 0, 255, 0.4)'
               },

               //return 100 band
               {
                 type: 'rect',
                 layer: 'below',
                 xref: 'x',
                 yref: 'y',
                 x0: startDate,
                 y0: rp100,
                 x1: endDate,
                 y1: Math.max(rp100, band_alt_max),
                 line: {width: 1},
                 fillcolor: 'rgba(127, 0, 255, 0.4)'
               },
             ];
         var update = {
             shapes: shapes,
         };
         Plotly.relayout(htmlELement, update);
       }
   })
 }
}
