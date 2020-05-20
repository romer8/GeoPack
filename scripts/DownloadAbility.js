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
  }
}
