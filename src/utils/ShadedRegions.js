function generateShadedRegions(sunData) {
    const {sunrise, sunset} = sunData;

    let tempSunrise = new Date();
    let tempSunset = new Date();

    const dayMiliseconds = 86400000
   
    // Rewind the temporary dates a bit from current to account for the previous sun cycle
    tempSunrise.setTime(sunrise.getTime() + (-1 * dayMiliseconds));
    tempSunset.setTime(sunset.getTime() + (-2 * dayMiliseconds));
    
    let shadedRegions = [];
    let sunriseLocal;
    let sunsetLocal;

    // Iterate through a couple days to generate a few sun cycles. Doesn't account for day to day changes in sunrise/sunset but who cares
    for (let i = 0; i < 7; i++) {
      tempSunrise.setDate(tempSunrise.getDate() + 1);
      tempSunset.setDate(tempSunset.getDate() + 1);

      sunriseLocal = tempSunrise.toISOString();
      sunsetLocal = tempSunset.toISOString();

      shadedRegions.push({'start': sunsetLocal, 'end': sunriseLocal})
    }
    console.log(shadedRegions)
    return shadedRegions
  }

export default generateShadedRegions;