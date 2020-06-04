
jest.mock('./scripts/historical')
jest.mock('./scripts/forecast.js')
jest.mock('./scripts/seasonal.js')
test('makes a hydrological report for a reach_id', async ()=>{
  // set up the dom document //
  document.body.innerHTML =

` <h1>Geo Package Test</h1>
  <h2>Forecast Records</h2>
  <div id="fr"></div>

  <h2>Forecast Emsembles</h2>
  <div id="fe"></div>

  <h2>Forecast Stats</h2>
  <div id="fs"></div>

  <h2>Historical Return Periods</h2>
  <div id="hr"></div>

  <h2>Historical No Return Periods</h2>
  <div id="h"></div>

  <h2>Seasonal</h2>
  <div id="s"> </div>`
  window.URL.createObjectURL = function() {};
  const GEOGLOWS =require('./scripts/Geoglows.js');
  const forecast = require('./scripts/forecast.js');
  const historical=require('./scripts/historical.js');
  const seasonal = require('./scripts/seasonal.js')
  const $ = require('jquery');

  // TEST FOR THE PACKAGE //
  const reach_id="3000002";
  const divHistorical = "h";
  const divHistoricalReturnPeriods = "hr";
  const divForecastRecords = "fr";
  const divForecastStats = "fs";
  const divForecastEnsembles = "fe";
  const divSeasonal = "s";
  const titleHistorical = "Rio Japones 1";
  const titleSeasonal = "Rio Japones 3";
  const titleForecast = "Rio Japones 2";
  const ensembles = [1,2,30,40,8,52];
  const ensembles2 = "all";
  const returnPeriodsCheck = true;
  const returnPeriodsCheck2 = false;
  const width = 1000;


  historical.graph(reach_id,divHistoricalReturnPeriods,titleHistorical,returnPeriodsCheck,width);
  expect(historical.graph).toHaveBeenLastCalledWith(reach_id,divHistoricalReturnPeriods,titleHistorical,returnPeriodsCheck,width);

  historical.graph(reach_id,divHistorical,titleHistorical,returnPeriodsCheck2,width);
  expect(historical.graph).toHaveBeenLastCalledWith(reach_id,divHistorical,titleHistorical,returnPeriodsCheck2,width);

  forecast.graph_fr(reach_id,divForecastRecords,titleForecast,returnPeriodsCheck,width);
  expect(forecast.graph_fr).toHaveBeenLastCalledWith(reach_id,divForecastRecords,titleForecast,returnPeriodsCheck,width);
  forecast.graph_emsembles(reach_id,divForecastEnsembles,ensembles2,titleForecast,width);
  expect(forecast.graph_emsembles).toHaveBeenLastCalledWith(reach_id,divForecastEnsembles,ensembles2,titleForecast,width);
  forecast.graph_stats(reach_id,divForecastStats,titleForecast,returnPeriodsCheck,width);
  expect(forecast.graph_stats).toHaveBeenLastCalledWith(reach_id,divForecastStats,titleForecast,returnPeriodsCheck,width);
  seasonal.graph(reach_id,divSeasonal,titleSeasonal,width);
  expect(seasonal.graph).toHaveBeenLastCalledWith(reach_id,divSeasonal,titleSeasonal,width);


})
