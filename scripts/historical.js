//Author: Elkin Giovanni Romero Bustamante

//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');
var $ = require("jquery");
var returnPeriods=require('./returnPeriods.js');
var download=require('./DownloadAbility.js');


//**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//


// var returnShapes;
var config = {};
const ENDPOINT="https://tethys2.byu.edu/localsptapi/api/";

  /**
  * The HISTORICAL object contains the functions that are related to the Historical data of a reach_id of a given stream.
  * @typedef {Object}
  * @property {Function} graph - Retrieves a plot of the historical data of the given reach_id.
 */
module.exports= {
  /**
   * Retrieves the plot related to the Historical Records for a given reach_id of an stream.
   * In addition, the function lets customize the width, heigh, and title of the graph if needed.
   * The retrieved plots are plotted using Plotly, so a button to download data has been added to the plots
   * @param {number} reachid - reach_id of an specific stream
   * @param {string} htmlElement - It is the id of the HTML element.
   * @param {string} title - it is the title of the grah (optional).
   * @param {boolean} rp -Tells the function to add the return periods to the plot of the Forecast Records.(optional).
   * @param {string} width - Especifies the width of the plot.(optional).
   * @param {string} height - Especifies the height of the plot.(optional).
   */
  graph: function(reachid,htmlElement,title,rp,width,height) {
    width = (typeof width !== 'undefined') ?  width : 600;
    height = (typeof heigth !== 'undefined') ?  heigth : 500;
    title = (typeof title !== 'undefined') ?  title : 'Reach ID: ' + reachid;
    rp = (typeof rp !== 'undefined') ?  rp : false;
    var dataObject={};
    var layer_URL=ENDPOINT +"HistoricSimulation/?reach_id="+reachid+"&return_format=json";
    var data_array=[];
    var returnPeriodsObject={};
    var dates = [];
    var values = [];
    var units;

    $.ajax({
      type:'GET',
      url: layer_URL,
      dataType: 'json',
      contentType:'application/json',
      success: function(resp) {

        var response_timeSeries = resp['time_series'];
        dates = response_timeSeries['datetime'];
        values =response_timeSeries['flow'];
        units =resp['units']['short'];
        units_name = resp['units']['name'];
        var title_download = `Historical Simulation ${title}`
        var xTitle = "Dates";
        var yTitle =`${resp['units']['name']} ${resp['units']['short']}`;
        config = download.addConfig(xTitle, yTitle, dates, values,title_download);
        var values_object = {
            name: 'Historical Records',
            x: dates,
            y: values,
            mode: "lines",
            line: {color: 'blue'}
        }
        data_array.push(values_object);
        var layer_URL_rp=ENDPOINT+"ReturnPeriods/?reach_id="+reachid+"&return_format=json";
          $.ajax({
            type:'GET',
            assync: true,
            url: layer_URL_rp,
            dataType: 'json',
            contentType:'application/json',
            success: function (data) {
              returnPeriodsObject = data['return_periods'];

              if(rp){
                returnPeriods.graph_rp(response_timeSeries,returnPeriodsObject,data_array,true);
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
              Plotly.purge(htmlElement);
              Plotly.newPlot(htmlElement, data_array, layout, config);
              }
          })
      },

    });
  },

}
