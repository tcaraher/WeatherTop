export const reportAnalytics = {
  getMax(valueName = "", reports) {
    let reportWithMaxValue = null;
    if (reports.length > 0) {
      reportWithMaxValue = reports[0];
      for (let i = 1; i < reports.length; i++) {
        if (reports[i][valueName] > reportWithMaxValue[valueName]) {
          reportWithMaxValue = reports[i];
        }
      }
    }
    return reportWithMaxValue[valueName];
  },
  getMin(valueName = "", reports) {
    let reportWithMinValue = null;
    if (reports.length > 0) {
      reportWithMinValue = reports[0];
      for (let i = 1; i < reports.length; i++) {
        if (reports[i][valueName] < reportWithMinValue[valueName]) {
          reportWithMinValue = reports[i];
        }
      }
    }
    return reportWithMinValue[valueName];
  },

}

