import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const reportController = {
  async index(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Editing report ${reportId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Song",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getReportById(reportId),
    };
    response.render("report-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    const updatedReport = {
      weathercode: request.body.weathercode,
      temperature: request.body.temperature,
      windspeed: Number(request.body.windspeed),
      winddirection: request.body.winddirection,
      pressure: request.body.pressure,
    }
    await reportStore.updateReport(reportId, updatedReport);
    response.redirect("/station/" + stationId);
  },
};
