import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import {weatherCodeMapping} from "../utils/weather-code-mapping.js";
import { reportAnalytics } from "../utils/reportAnalytics.js";
import dayjs from "dayjs";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);

    station.recentReport = station.reports[0];
    if (station.reports.length > 0) {
      station.reportAnalytics = {
        maxTemp: reportAnalytics.getMax("temperature", station.reports),
        minTemp: reportAnalytics.getMin("temperature", station.reports),
        maxWindSpeed: reportAnalytics.getMax("windspeed", station.reports),
        minWindSpeed: reportAnalytics.getMin("windspeed", station.reports),
        maxPressure: reportAnalytics.getMax("pressure", station.reports),
        minPressure: reportAnalytics.getMin("pressure", station.reports),
      };
    }

    const viewData = {
      title: "Stations",
      station: station,
    };
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);

    const timestamp = dayjs()

    const newReport = {
      timestamp: timestamp.format("YYYY-MM-DD HH:mm:ss"),
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
    await reportStore.deleteReport(request.params.reportid);
    response.redirect("/station/" + stationId);
  },
};
