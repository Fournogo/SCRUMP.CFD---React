import { MultiLoader } from '../utils/MultiLoader';
import findIcon from '../utils/iconUtil';

async function DailyForecastUtil(data) {
    const properName = data.properName
    const { dailyForecastLink, currentConditionsLink } = data.dailyForecastData;
    
    const dailyForecastData = await MultiLoader(dailyForecastLink)
    .then((response) => response.json())
    .then((responseJSON) => responseJSON.properties.periods)
    
    const currentConditionsData = await MultiLoader(currentConditionsLink)
    .then((response) => response.json())
    .then((responseJSON) => responseJSON.properties)

    // Arrays for daily forecasts
    const timePeriod = [];
    const dailyTemp = [];
    const dailyDewPoint = [];
    const dailyPrecip = [];
    
    const iconArray = [];
    for (let i = 0; i < 14; i++) {
        let precipValue = dailyForecastData[i].probabilityOfPrecipitation.value
        let timeValue = dailyForecastData[i].name
        let tempValue = (Math.round(dailyForecastData[i].temperature,2) + ' F')
        let dewPointValue = (Math.round(dailyForecastData[i].dewpoint.value * 1.8 + 32,2) + ' F');
        
        let shortForecast = dailyForecastData[i].shortForecast
        let iconLink = findIcon(shortForecast)

        if (precipValue == null || precipValue == 0) {
            precipValue = "~0%";
        } else {
            precipValue += "%"
        }

        iconArray.push(iconLink)
        timePeriod.push(timeValue);
        dailyTemp.push(tempValue);
        dailyDewPoint.push(dewPointValue);
        dailyPrecip.push(precipValue);
    }
    
    // Arrays for current conditions
    const currentTemp = [];
    const currentDewPoint = [];
    const currentPrecip = [];
    const currentIcon = [];

    currentTemp.push(Math.round(currentConditionsData.temperature.value * 1.8 + 32,1) + ' F');
    currentDewPoint.push(Math.round(currentConditionsData.dewpoint.value * 1.8 + 32,1) + ' F');
    currentPrecip.push(dailyPrecip[0]);
    currentIcon.push(findIcon(currentConditionsData.textDescription));
    
    return ({
        "regionProperName": properName,
        "currentConditions": {
            "Temp": currentTemp,
            "Dew Point": currentDewPoint,
            "Precip Chance": currentPrecip,
            "Icons": currentIcon
        },
        "forecastData": {
            "Timeframe": timePeriod,
            "Temp": dailyTemp,
            "Dew Point": dailyDewPoint,
            "Precip Chance": dailyPrecip,
            "Icons": iconArray
        }
    });
}; 

export default DailyForecastUtil;