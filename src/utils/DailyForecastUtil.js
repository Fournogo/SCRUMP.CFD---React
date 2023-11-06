import { MultiLoader } from '../utils/MultiLoader';

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
    let timePeriod = [];
    let dailyTemp = [];
    let dailyDewPoint = [];
    let dailyPrecip = [];
    
    for (let i = 0; i < 14; i++) {
        if (dailyForecastData[i].probabilityOfPrecipitation.value == null || dailyForecastData[i].probabilityOfPrecipitation.value == 0) {
            dailyForecastData[i].probabilityOfPrecipitation.value = "~0%";
        } else {
            dailyForecastData[i].probabilityOfPrecipitation.value += "%"
        }
        
        timePeriod.push(dailyForecastData[i].name);
        dailyTemp.push(Math.round(dailyForecastData[i].temperature,2) + ' F');
        dailyDewPoint.push(Math.round(dailyForecastData[i].dewpoint.value * 1.8 + 32,2) + ' F');
        dailyPrecip.push(dailyForecastData[i].probabilityOfPrecipitation.value);
    }
    
    // Arrays for current conditions
    let currentTemp = [];
    let currentDewPoint = [];
    let currentPrecip = [];

    currentTemp.push(Math.round(currentConditionsData.temperature.value * 1.8 + 32,1) + ' F');
    currentDewPoint.push(Math.round(currentConditionsData.dewpoint.value * 1.8 + 32,1) + ' F');
    currentPrecip.push(dailyForecastData[0].probabilityOfPrecipitation.value);

    return ({
        "regionProperName": properName,
        "currentConditions": {
            "Temp": currentTemp,
            "Dew Point": currentDewPoint,
            "Precip Chance": currentPrecip
        },
        "forecastData": {
            "Timeframe": timePeriod,
            "Temp": dailyTemp,
            "Dew Point": dailyDewPoint,
            "Precip Chance": dailyPrecip
        }
    });
}; 

export default DailyForecastUtil;