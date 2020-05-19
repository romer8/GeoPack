/**This Module only exports a graph containing historical data,
it can be added with more functions if neeeded, porobably something great
will be to have the coordinates of lat long available to makeable to plot a graph.
**/
//*** REQUIRE LIBRARIES***///
var Plotly = require('plotly.js-dist');

var $ = require("jquery");

var returnPeriods = require('./getReturnPeriods.js'); //**GLOBAL VARIABLES TO DEAL WITH THE FUNCTIONS**//


var dates = {
  highres: [],
  dates: []
};
var values = {
  highres: [],
  max: [],
  mean: [],
  min: [],
  std_dev_range_lower: [],
  std_dev_range_upper: []
};
var returnShapes;
var endpoint = "https://tethys2.byu.edu/localsptapi/api/"; //** THIS FUNCTIONS RETRIEVES THE HISTORICAL DATA IN A GRAPH **//

module.exports = {
  graph_h: function (reachid, htmlELement, add, width, height) {
    width = typeof width !== 'undefined' ? width : 500;
    height = typeof heigth !== 'undefined' ? heigth : 500;
    add = typeof add !== 'undefined' ? add : false;
    var dataObject = {};
    console.log('WE HAVE ENTERED GETHISTORICDATA FUNCTION()');
    var layer_URL = endpoint + "HistoricSimulation/?reach_id=" + reachid + "&return_format=csv";
    $.ajax({
      type: 'GET',
      url: layer_URL,
      dataType: 'text',
      contentType: 'text/plain',
      success: function (data) {
        console.log('we have succeed gethistorical'); // console.log(data);

        var allLines = data.split('\n');
        var headers = allLines[0].split(','); // console.log("historical");
        // console.log(allLines);

        for (var i = 1; i < allLines.length; i++) {
          var data = allLines[i].split(',');

          if (headers.includes('high_res (m3/s)')) {
            if (data[2] !== 'nan') {
              dates.dates.push(data[0]);
              values.mean.push(data[3]);
            }
          } else {
            dates.dates.push(data[0]);
            values.mean.push(data[1]);
          }
        }
      },
      complete: function () {
        // console.log("COMPLETE PART OF Streamflow()");
        var mean = {
          name: 'Mean',
          x: dates.dates,
          y: values.mean,
          mode: "lines",
          line: {
            color: 'blue'
          }
        };
        var data = [mean];
        var layout = {
          autosize: true,
          // title: 'Historical Streamflow<br>'+titleCase(watershed) + ' Reach ID:' + comid,
          title: 'Historical Streamflow<br>' + ' Reach ID:' + reachid,
          width: width,
          height: height,
          xaxis: {
            title: 'Date',
            showgrid: false
          },
          yaxis: {
            title: 'Streamflow m3/s',
            range: [0, Math.max(...data[0].y) + Math.max(...data[0].y) / 5],
            showgrid: false
          } // plot_bgcolor:"#7782c5",
          //shapes: returnShapes,

        }; //Removing any exisisting element with the same name//

        Plotly.purge(htmlELement);
        Plotly.newPlot(htmlELement, data, layout);
        var index = data[0].x.length - 2;
        console.log("printing the historic data index, the last one");
        console.log(data[0].x.length[index]);
        returnPeriods.graph_rp(reachid, data[0].x[0], data[0].x[index], width, height, htmlELement); // getreturnperiods(reachid, data[0].x[0], data[0].x[index],width,height);

        dates.highres = [], dates.dates = [];
        values.highres = [], values.max = [], values.mean = [], values.min = [], values.std_dev_range_lower = [], values.std_dev_range_upper = [];
      }
    });
  },
  downloadData: function (reachid) {
    // THIS IS A FUNCTION TO DOWNLOAD DATA //
    var downloadUrl = endpoint + "HistoricSimulation/?reach_id=" + reachid + "&return_format=csv"; // var downloadUrl="https://tethys2.byu.edu/localsptapi/api/"+"ForecastEnsembles/?reach_id="+reachid+"&return_format=csv";

    var req = new XMLHttpRequest();
    req.open("GET", downloadUrl, true);
    req.responseType = "blob"; // if the API requires the headers///
    // req.setRequestHeader('my-custom-header', 'custom-value'); // adding some headers (if needed)

    req.onload = function (event) {
      var blob = req.response;
      var fileName = reachid;
      var contentType = req.getResponseHeader("content-type"); //IE/EDGE seems not returning some response header

      if (req.getResponseHeader("content-disposition")) {
        console.log("enter first if");
        var contentDisposition = req.getResponseHeader("content-disposition");
        fileName = contentDisposition.substring(contentDisposition.indexOf("=") + 1);
      } else {
        fileName = reachid + " Historical." + contentType.substring(contentType.indexOf("/") + 1);
      }

      if (window.navigator.msSaveOrOpenBlob) {
        // Internet Explorer
        window.navigator.msSaveOrOpenBlob(new Blob([blob], {
          type: contentType
        }), fileName);
      } else {
        var el = document.createElement("a");
        el.id = "target"; // var el = document.getElementById("target");

        el.href = window.URL.createObjectURL(blob);
        el.download = fileName;
        el.click();
        window.URL.revokeObjectURL(el.href);
      }
    };

    req.send();
  },
  // FIND THE LOCATION OF THE STREAM BY THE LAT AND LONG AND ALSO PRODUCE A GRAPH :)
  locationGraph_h: function (lat, lon, htmlELement, add, width, height) {
    width = typeof width !== 'undefined' ? width : 500;
    height = typeof heigth !== 'undefined' ? heigth : 500;
    add = typeof add !== 'undefined' ? add : false;
    var layer_URL1 = endpoint + "GetReachID/?lat=" + lat + "&long=" + lon;
    $.ajax({
      type: 'GET',
      url: layer_URL1,
      success: function (data) {
        var dataText = JSON.stringify(data);
        var reachid = dataText['reach_id'];
        var layer_URL = endpoint + "HistoricSimulation/?reach_id=" + reachid + "&return_format=csv";
        $.ajax({
          type: 'GET',
          url: layer_URL,
          dataType: 'text',
          contentType: 'text/plain',
          success: function (data) {
            console.log('we have succeed gethistorical');
            var allLines = data.split('\n');
            var headers = allLines[0].split(',');

            for (var i = 1; i < allLines.length; i++) {
              var data = allLines[i].split(',');

              if (headers.includes('high_res (m3/s)')) {
                if (data[2] !== 'nan') {
                  dates.dates.push(data[0]);
                  values.mean.push(data[3]);
                }
              } else {
                dates.dates.push(data[0]);
                values.mean.push(data[1]);
              }
            }
          },
          complete: function () {
            // console.log("COMPLETE PART OF Streamflow()");
            var mean = {
              name: 'Mean',
              x: dates.dates,
              y: values.mean,
              mode: "lines",
              line: {
                color: 'blue'
              }
            };
            var data = [mean];
            var layout = {
              // title: 'Historical Streamflow<br>'+titleCase(watershed) + ' Reach ID:' + comid,
              title: 'Historical Streamflow<br>' + ' Reach ID:' + reachid,
              xaxis: {
                title: 'Date',
                showgrid: false
              },
              yaxis: {
                title: 'Streamflow m3/s',
                range: [0, Math.max(...data[0].y) + Math.max(...data[0].y) / 5],
                showgrid: false
              } // plot_bgcolor:"#7782c5",
              //shapes: returnShapes,

            }; //Removing any exisisting element with the same name//

            Plotly.purge(htmlELement);
            Plotly.newPlot(htmlELement, data, layout);
            var index = data[0].x.length - 2;
            console.log("printing the historic data index, the last one");
            console.log(data[0].x.length[index]);
            returnPeriods.graph_rp(reachid, data[0].x[0], data[0].x[index], width, height); // getreturnperiods(reachid, data[0].x[0], data[0].x[index],width,height);

            dates.highres = [], dates.dates = [];
            values.highres = [], values.max = [], values.mean = [], values.min = [], values.std_dev_range_lower = [], values.std_dev_range_upper = [];
          }
        });
      }
    });
  }
};