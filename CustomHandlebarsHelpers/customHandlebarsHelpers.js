export const customHandlebarsHelpers = {
  // https://www.shecodes.io/athena/53546-how-to-convert-celsius-to-fahrenheit-in-javascript
  celsiusToFahrenheit (celsius) {
    const fahrenheit = celsius * 9 / 5 + 32;
    return fahrenheit;
  },
  // https://www.campbellsci.com/blog/convert-wind-directions
  windDegreesToCompassDirections (windDirectionInDegrees) {
    const directions = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"]
    const modDirectionDegrees = windDirectionInDegrees%360;
    // divide mod by 22.5 and round, giving us 16 possibilities, the matching up with our array of directions and therefore it's index
    console.log(Math.round(modDirectionDegrees/22.5))
    return directions[Math.round(modDirectionDegrees/22.5)]
  }
};