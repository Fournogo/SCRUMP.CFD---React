
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
  
  function radiansToDegrees(radians) {
    return radians * (180 / Math.PI)
}
  
  function getJulian(date) {
      return (date / 86400000) + 2440587.5;
}

function solarCalcs(obsLatitude, obsLongitude) {
  
    let today = new Date();
    today.setHours(12, 0, 0, 0)
      
    let julian = getJulian(today);
  
    let julianCentury = (julian - 2451545) / 36525;
    let geomMeanLongSunDeg = 280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032) % 360;
    let geomMeanAnomSunDeg = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
  
    let geomMeanLongSunRad = degreesToRadians(geomMeanLongSunDeg);
    let geomMeanAnomSunRad = degreesToRadians(geomMeanAnomSunDeg);
  
    let earthEccent = 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);
    // Check here for problem if it arises
    let sunEquationCenter = Math.sin(geomMeanAnomSunRad) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) + Math.sin(2 * geomMeanAnomSunRad) * (0.019993-0.000101 * julianCentury) + Math.sin(3 * geomMeanAnomSunRad) * 0.000289;
  
    let sunTrueLongDeg = geomMeanLongSunDeg + sunEquationCenter;

    let sunAppLongDeg = sunTrueLongDeg - 0.00569 - 0.00478 * Math.sin(degreesToRadians(125.04 - 1934.136 * julianCentury));
    let sunAppLongRad = degreesToRadians(sunAppLongDeg);
    let meanOblEclipticDeg = 23 + (26 + ((21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813)))) / 60) / 60;
  
    let oblCorrDeg = meanOblEclipticDeg + 0.00256 * Math.cos(degreesToRadians(125.04-1934.136 * julianCentury));
    let oblCorrRad = degreesToRadians(oblCorrDeg);

    let sunDeclinationRad = Math.asin(Math.sin(oblCorrRad) * Math.sin(sunAppLongRad));
    let sunDeclinationDeg = radiansToDegrees(sunDeclinationRad);
  
    let varY = Math.tan(oblCorrRad / 2) ** 2
  
    let equationOfTimeMin = 4 * radiansToDegrees(
      varY * Math.sin(2 * geomMeanLongSunRad) 
      - 2 * earthEccent * Math.sin(geomMeanAnomSunRad) 
      + 4 * earthEccent * varY * Math.sin(geomMeanAnomSunRad) * Math.cos(2 * geomMeanLongSunRad)
      - 0.5 * varY * varY * Math.sin(4 * geomMeanLongSunRad)
      - 1.25 * earthEccent * earthEccent * Math.sin(2 * geomMeanAnomSunRad)
    );
  
    let haSunriseDeg = radiansToDegrees(
      Math.acos(Math.cos(degreesToRadians(90.833)) / (Math.cos(degreesToRadians(obsLatitude)) * Math.cos(sunDeclinationRad)) - Math.tan(degreesToRadians(obsLatitude)) * Math.tan(sunDeclinationRad))
    );
  
    let solarNoonDecimalUTC = (720 - 4 * obsLongitude - equationOfTimeMin) / 1440;

    //SUNRISE AND SUNSET IN DECIMALS
    let sunriseDecimalUTC = (solarNoonDecimalUTC - haSunriseDeg * 4/1440);
    let sunsetDecimalUTC = (solarNoonDecimalUTC + haSunriseDeg * 4/1440);
    
    let maxSunAngle = 90 - Math.abs(obsLatitude) + sunDeclinationDeg;
    
    return({'sunriseDecimalUTC': sunriseDecimalUTC, 'sunsetDecimalUTC': sunsetDecimalUTC, 'maxSunAngle': maxSunAngle})
    //return sunrise utc, sunset utc, max sun angle
  
  };

  function normalizeTimes(sunriseDecimalUTC, sunsetDecimalUTC) {
    let sunrise = new Date();
    let sunset = new Date();

    sunrise.setUTCHours(0,0,0,0)
    sunset.setUTCHours(0,0,0,0)

    let sunriseDay = Math.trunc(sunriseDecimalUTC)
    let sunsetDay = Math.trunc(sunsetDecimalUTC)

    sunrise.setUTCMilliseconds((sunriseDecimalUTC - sunriseDay) * 86400000)
    sunset.setUTCMilliseconds((sunsetDecimalUTC - sunsetDay) * 86400000)
    
    let daylight = new Date((sunset - sunrise));

    return ({'daylight': daylight, 'sunrise': sunrise, 'sunset': sunset })
}

function doSolarCalcs( regionData ) {
    const obsLatitude = regionData.sunFaxData.coordinates[0]
    const obsLongitude = regionData.sunFaxData.coordinates[1]

    const {sunriseDecimalUTC, sunsetDecimalUTC, maxSunAngle} = solarCalcs(obsLatitude, obsLongitude)

    const {daylight, sunrise, sunset} = normalizeTimes(sunriseDecimalUTC, sunsetDecimalUTC)
    
    return({'sunrise': sunrise, 'sunset': sunset, 'daylight': daylight, 'maxSunAngle': maxSunAngle})
}

export default doSolarCalcs;