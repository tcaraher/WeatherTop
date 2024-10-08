import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { reportAnalytics } from "../utils/reportAnalytics.js";
import { reportStore } from "../models/report-store.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const stations = await stationStore.getStationsByUserId(loggedInUser._id);

    // creates a recent report from each stations' reports, and sets up an analytics object to calculate the min and max of all fields.
    for (const station of stations) {
      const stationReports = await stationStore.getStationById(station._id);
      station.recentReport = stationReports.reports[0];
      if (stationReports.reports.length > 0) {
        station.reportAnalytics = {
          maxTemp: reportAnalytics.getMax("temperature", stationReports.reports),
          minTemp: reportAnalytics.getMin("temperature", stationReports.reports),
          maxWindSpeed: reportAnalytics.getMax("windspeed", stationReports.reports),
          minWindSpeed: reportAnalytics.getMin("windspeed", stationReports.reports),
          maxPressure: reportAnalytics.getMax("pressure", stationReports.reports),
          minPressure: reportAnalytics.getMin("pressure", stationReports.reports),
        };
      }
    }

    // Sorts the stations alphabetically
    // https://www.freecodecamp.org/news/how-to-sort-array-of-objects-by-property-name-in-javascript/
    stations.sort((a, b) => a.station.localeCompare(b.station));

    const viewData = {
      title: "Weather Top Dashboard",
      stations: stations,
    };
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      station: request.body.station,
      longitude: request.body.longitude,
      latitude: request.body.latitude,
      userid: loggedInUser._id,
    };
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  // Deletes station and reports by station Id
  async deleteStation(request, response) {
    const stationId = request.params.id;
    await reportStore.deleteReportsByStationId(stationId)
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },
};
