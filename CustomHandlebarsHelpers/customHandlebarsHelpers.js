export const customHandlebarsHelpers = {
  // https://www.shecodes.io/athena/53546-how-to-convert-celsius-to-fahrenheit-in-javascript
  celsiusToFahrenheit (celsius) {
    const fahrenheit = celsius * 9 / 5 + 32;
    return fahrenheit;
  }
};