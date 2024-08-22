import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import {weatherCodeMapping} from "../utils/weather-code-mapping.js";
import { utils } from "../utils/utils.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const maxTemp = utils.getMax("temperature", station.reports)
    const minTemp = utils.getMin("temperature", station.reports)
    const maxWindSpeed = utils.getMax("windspeed", station.reports)
    const minWindSpeed = utils.getMin("windspeed", station.reports)
    const maxPressure = utils.getMax("pressure", station.reports)
    const minPressure = utils.getMin("pressure", station.reports)
    const viewData = {
      title: "Stations",
      station: station,
      maxTemp: maxTemp,
      minTemp: minTemp,
      maxWindSpeed: maxWindSpeed,
      minWindSpeed: minWindSpeed,
      maxPressure: maxPressure,
      minPressure: minPressure,
    };
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReport = {
      weathercode: request.body.weathercode,
      weathercodedesc: weatherCodeMapping.getWeatherCodeDesc(request.body.weathercode),
      weathercodeimgurl: weatherCodeMapping.getWeatherCodeImg(request.body.weathercode),
      temperature: Number(request.body.temperature),
      windspeed: Number(request.body.windspeed),
      winddirection: Number(request.body.winddirection),
      pressure: Number(request.body.pressure),
    };
    console.log(`adding report ${newReport.weathercode}`);
    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },

  async deleteReport(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Deleting Report ${reportId} from Station ${stationId}`);
    await reportStore.deleteReport(request.params.reportId);
    response.redirect("/station/" + stationId);
  },
};
