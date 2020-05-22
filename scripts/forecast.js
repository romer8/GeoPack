/**
Author: Elkin Giovanni Romero Bustamante
Function: This module only deals with the forecast data, and it should be good
to add functions realted to find the forecast with lat and long as it goes**/

//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');
var $ = require("jquery");
var download=require('./DownloadAbility.js');
var math=require('mathjs');
var randomColor = require('randomcolor'); // import the script


//**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//
// var dates = {highres: [], dates: []};
// var values = {highres: [], max: [], mean: [], min: [], std_dev_range_lower: [], std_dev_range_upper: [],emsembles:{}};
// var units;
// var config = {};
var endpoint="http://0.0.0.0:8090/api/"
//** THIS FUNCTIONS RETRIEVES THE FORECAST DATA IN A GRAPH **//

module.exports= {
  graph_fr: function(reachid,htmlELement, title, width,height){
  width = (typeof width !== 'undefined') ?  width : 500;
  height = (typeof heigth !== 'undefined') ?  heigth : 500;
  title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;
  var dates = {highres: [], dates: []};
  var values = {highres: [], max: [], mean: [], min: [], std_dev_range_lower: [], std_dev_range_upper: [],emsembles:{}};
  var units;
  var config = {};

  var layer_URL=endpoint +"/ForecastRecords/?reach_id="+reachid+"&return_format=json";
    $.ajax({
      type: 'GET',
      url: layer_URL,
      success: function(data) {
        console.log(data);
        var response_timeSeries = data['time_series'];
        var dates_prep = response_timeSeries['datetime'];
        dates['dates']=dates_prep

        values['mean'] = data['time_series']['flow'];

        units =data['units']['short'];
        units_name = data['units']['name'];

        var title_download = `Forecast Mean Records ${title}`
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

         // dates.highres = [], dates.dates = [];
         // values.highres = [], values.max = [], values.mean = [], values.min = [], values.std_dev_range_lower = [], values.std_dev_range_upper = [];
      },
    });
  },
  graph_emsembles: function(reachid,htmlELement,arrayEnsemble, title, width,height){
    width = (typeof width !== 'undefined') ?  width : 500;
    height = (typeof heigth !== 'undefined') ?  heigth : 500;
    title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;
    arrayEnsemble = (typeof arrayEnsemble !== 'string') ? arrayEnsemble: Array.from(Array(52).keys());
    var dates = {highres: [], dates: []};
    var values = {emsembles:{}};
    var units;
    var config = {};
    var dataToDownload={};
    var title_download = `Forecast Ensembles ${title}`

    var layer_URL=endpoint +"/ForecastEnsembles/?reach_id="+reachid+"&return_format=json";
    $.ajax({
      type: 'GET',
      url: layer_URL,
      success: function(data) {
        // console.log(data);
        var response_timeSeries = data['time_series'];
        var dates_prep = response_timeSeries['datetime'];
        var dates_prep_high_res = response_timeSeries['datetime_high_res'];
        // Pushing the dates for the normal ensembles //
        dates['dates']=dates_prep;
        dates['highres'] = dates_prep_high_res;

        const time_series_keys = Object.keys(response_timeSeries);
        time_series_keys.forEach(function(x){
          if(x !== "datetime" && x!=="datetime_high_res" ){
            values['emsembles'][`${x}`] = response_timeSeries[`${x}`];
          }
        });
        units =data['units']['short'];
        units_name = data['units']['name'];


    },
    complete: function() {
       const values_emsembles_keys = Object.keys(values['emsembles']);
       var data=[];
       //making the trace object for all the emsembles //
       var numberEnsemble = 0;

       values_emsembles_keys.forEach(function(x){
         numberEnsemble = numberEnsemble +1 ;
         if(arrayEnsemble.includes(numberEnsemble)){
           var nameEnsemble = x.split('_m')[0]
           if(x !== "ensemble_52_m^3/s"){
             var singleEmsemble={
               name: `${nameEnsemble}`,
               x: dates.dates,
               y: values['emsembles'][`${x}`],
               mode: "scatter",
               line: {
                 color: randomColor(),
                 // shape: 'spline'
               }
             }
             data.push(singleEmsemble);

             // add data to download //
             if(!dataToDownload.hasOwnProperty('datetime')){
               dataToDownload['datetime']=dates.dates;
             }

             dataToDownload[`${x}`]=values['emsembles'][`${x}`]
           }
           else{
             console.log(x);
             console.log(values['emsembles'][`${x}`]);
             console.log(dates.highres);
             var singleEmsemble={
               name: `${nameEnsemble}`,
               x: dates.highres,
               y: values['emsembles'][`${x}`],
               mode: "lines",
               line: {
                 color: randomColor(),
                 // shape: 'spline'
               }
             }
             data.push(singleEmsemble);

             dataToDownload['datetime_high_res'] = dates.highres;
             dataToDownload[`${x}`] = values['emsembles'][`${x}`];

           }

         }

       })
       console.log(dataToDownload);
       config = download.addConfigObject(dataToDownload,title_download);

         var layout = {
             width:width,
             height:height,
             title:'Forecast Emsembles<br>' + title,
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

      },
    });
  },
  graph_stats:function(reachid,htmlELement, title, width,height){
    width = (typeof width !== 'undefined') ?  width : 500;
    height = (typeof heigth !== 'undefined') ?  heigth : 500;
    title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;
    var dates = {highres: [], dates: []};
    var values = {};
    var style = {
      'flow_25%_m^3/s':{fill:'tonexty', Linecolor:'rgb(152, 251, 152)' },
      'flow_75%_m^3/s':{fill:'tonexty', Linecolor:'rgb(34, 139, 34)' },
      'flow_avg_m^3/s':{fill:'none', Linecolor:'blue' },
      'flow_max_m^3/s':{fill:'tonexty', Linecolor:'rgb(147, 8, 243)'},
      'flow_min_m^3/s':{fill:'none', Linecolor:'rgb(29, 234, 228)' },
      'high_res':{fill:'none', Linecolor:'black' },
    }
    var units;
    var config = {};
    var dataToDownload={};
    var dataPlot=[];
    var title_download = `Forecast Stats ${title}`

    var layer_URL=endpoint +"/ForecastStats/?reach_id="+reachid+"&return_format=json";
    $.ajax({
      type: 'GET',
      url: layer_URL,
      success: function(data) {
        // console.log(data);
        var response_timeSeries = data['time_series'];
        var dates_prep = response_timeSeries['datetime'];
        var dates_prep_high_res = response_timeSeries['datetime_high_res'];
        // Pushing the dates for the normal ensembles //
        dates['dates']=dates_prep;
        dates['highres'] = dates_prep_high_res;

        const time_series_keys = Object.keys(response_timeSeries);
        time_series_keys.forEach(function(x){
          if(x !== "datetime" && x!=="datetime_high_res" ){
            values[`${x}`] = response_timeSeries[`${x}`];
            if(x !== "high_res"){

              var singleEmsemble={
                name: `${x}`,
                x: dates.dates,
                y: values[`${x}`],
                mode: "scatter",
                fill:style[`${x}`]['fill'],
                line: {
                  color:style[`${x}`]['Linecolor'] ,
                }
              }
              if(!dataToDownload.hasOwnProperty('datetime')){
                dataToDownload['datetime']=dates.dates;
              }

              dataToDownload[`${x}`]=values[`${x}`]
              dataPlot.push(singleEmsemble);
            }
            else{
              var singleEmsemble={
                name: `${x}`,
                x: dates.highres,
                y: values[`${x}`],
                mode: "scatter",
                line: {
                  color: style[`${x}`]['Linecolor'],
                }
              }
              dataToDownload['datetime_high_res'] = dates.highres;
              dataToDownload[`${x}`] = values[`${x}`];
              dataPlot.push(singleEmsemble);
            }
          }
        });
        units =data['units']['short'];
        units_name = data['units']['name'];


    },
    complete: function() {

       console.log(dataToDownload);
       config = download.addConfigObject(dataToDownload,title_download);

         var layout = {
             width:width,
             height:height,
             title:'Forecast Emsembles<br>' + title,
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
         Plotly.newPlot(htmlELement, dataPlot, layout,config);

      },
    });

  }

}
