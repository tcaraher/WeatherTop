import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports () {
    await db.read();
    return db.data.reports;
  },

  async addReport (stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    // Pushes to beginning of array so older reports get pushed back. I felt this is more intuitive for this application
    db.data.reports.unshift(report);
    await db.write();
    return report;
  },

  async getReportsByStationId (id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === id);
  },

  async getReportById (id) {
    await db.read();
    return db.data.reports.find((report) => report._id === id);
  },

  async deleteReport (id) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === id);
    db.data.reports.splice(index, 1);
    await db.write();
  },

  async deleteReportsByStationId (stationId) {
    const reportsToDelete = await this.getReportsByStationId(stationId)
    for (const report of reportsToDelete) {
      await this.deleteReport(report._id)
    }
  },

  async deleteAllReports () {
    db.data.reports = [];
    await db.write();
  },

  // Checks if the user has only updated certain fields
  async updateReport (reportId, updatedReport) {
    const report = await this.getReportById(reportId);
    if (updatedReport.weathercode !== "") {
      report.weathercode = updatedReport.weathercode;
    }
    if (updatedReport.temperature !== "") {
      report.temperature = updatedReport.temperature;
    }
    if (updatedReport.windspeed !== "") {
      report.windspeed = Number(updatedReport.windspeed);
    }
    if (updatedReport.winddirection !== "") {
      report.winddirection = updatedReport.winddirection;
    }
    if (updatedReport.winddirection !== "") {
      report.winddirection = updatedReport.winddirection;
    }
    await db.write();
  }
};
