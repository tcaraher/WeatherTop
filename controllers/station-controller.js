import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { weatherCodeMapping } from "../utils/weather-code-mapping.js";
import { reportAnalytics } from "../utils/reportAnalytics.js";
import dayjs from "dayjs";
import axios from "axios";

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
    const timestamp = dayjs();
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

  async addGeneratedReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    let newReport = {};
    const lat = station.latitude;
    const lng = station.longitude;
    const latLongRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=1fb6d84433fe8c6d5d82623b67f64fbe`;
    const result = await axios.get(latLongRequestUrl);
    const timestamp = dayjs();

    if (result.status == 200) {
      const currentWeather = result.data;
      newReport.timestamp = timestamp.format("YYYY-MM-DD HH:mm:ss"),
      newReport.weathercode = currentWeather.weather[0].id;
      newReport.weathercodedesc = weatherCodeMapping.getWeatherCodeDesc(newReport.weathercode);
      newReport.weathercodeimgurl = weatherCodeMapping.getWeatherCodeImg(newReport.weathercode);
      newReport.temperature = currentWeather.main.temp;
      newReport.winddirection = currentWeather.wind.deg;
      newReport.windspeed = currentWeather.wind.speed;
      newReport.pressure = currentWeather.main.pressure;
    }

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
