/*
File: DownloadAbility.js
Author: Giovanni Romero Bustamante
Function: This gives the ability to add a download button to the plotly graph
*/
var Plotly = require('plotly.js-dist');

module.exports={
  addConfig : function(xTitle, yTitle, xArray, yArray,title_graph){
    var config = {
      modeBarButtonsToAdd: [{ name: 'downloadCsv', title: 'Download data as csv', icon: Plotly.Icons.disk, click: function(){
        var csvData = [];
        var header = [xTitle,yTitle] //main header.
        csvData.push(header);
        for (var i = 0; i < xArray.length; i++){ //data
          var line = [xArray[i],yArray[i]];
          csvData.push(line);
        }
        var csvFile = csvData.map(e=>e.map(a=>'"'+((a||"").toString().replace(/"/gi,'""'))+'"').join(",")).join("\r\n"); //quote all fields, escape quotes by doubling them.
        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", title_graph.replace(/[^a-z0-9_.-]/gi,'_') + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        } }],
    }
    return config;
  },
  addConfigObject : function(xObject,title_graph){
    var config = {
      modeBarButtonsToAdd: [{ name: 'downloadCsv', title: 'Download data as csv', icon: Plotly.Icons.disk, click: function(){
        var csvData = [];
        var header = Object.keys(xObject); //main header.
        var header2 =Object.keys(xObject);
        var indexDateTime= header.indexOf("datetime");
        var indexDateTimeHighRes = header.indexOf("datetime_high_res");
        if(indexDateTimeHighRes > -1){
          header.splice(indexDateTimeHighRes,1);
          var indexValuesHighRes;

          if(header.indexOf("ensemble_52_m^3/s") > 0){
            indexValuesHighRes = header.indexOf("ensemble_52_m^3/s");
            header.splice(indexValuesHighRes,1);
            header.push(header2[indexDateTimeHighRes]);
            header.push(header2[header2.indexOf("ensemble_52_m^3/s")]);
            csvData.push(header);

            for (var i = 0; i < xObject[`ensemble_52_m^3/s`].length; i++){ //data
              var line = [];
              header.forEach(function(x){
                console.log(xObject[`${x}`]);
                if(xObject[`${x}`].length > i ){
                  line.push(xObject[`${x}`][i]);
                }
                else{
                  line.push(xObject[`${x}`][i]);
                }
              })
              csvData.push(line);
            }
          }
          else{
            indexValuesHighRes = header.indexOf("high_res");
            header.splice(indexValuesHighRes,1);
            header.push(header2[indexDateTimeHighRes]);
            header.push(header2[header2.indexOf("high_res")]);
            csvData.push(header);

            for (var i = 0; i < xObject[`high_res`].length; i++){ //data
              var line = [];
              header.forEach(function(x){
                console.log(xObject[`${x}`]);
                if(xObject[`${x}`].length > i ){
                  line.push(xObject[`${x}`][i]);
                }
                else{
                  line.push(xObject[`${x}`][i]);
                }
              })
              csvData.push(line);
            }
          }

        }
        else{
          csvData.push(header);
          for (var i = 0; i < xObject[`${header[0]}`].length; i++){ //data
            var line = [];
            header.forEach(function(x){
              console.log(xObject[`${x}`]);
              if(xObject[`${x}`].length > i ){
                line.push(xObject[`${x}`][i]);
              }
              else{
                line.push(xObject[`${x}`][i]);
              }
            })
            csvData.push(line);
          }

        }

        var csvFile = csvData.map(e=>e.map(a=>'"'+((a||"").toString().replace(/"/gi,'""'))+'"').join(",")).join("\r\n"); //quote all fields, escape quotes by doubling them.
        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", title_graph.replace(/[^a-z0-9_.-]/gi,'_') + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        } }],
    }
    return config;
  }

}
