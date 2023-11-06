import { MultiLoader } from '../utils/MultiLoader';

// FIX THE DATES PROVIDED BY THE DARN EPA
function EPA2Date (EPAdate) {
    let month;
    let hour;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for (let i = 0; i < months.length; i++) {
        if (months[i] == EPAdate.slice(0,3)) {
            month = i;
        }
    }
    const day = EPAdate.slice(4,6);
    const year = EPAdate.slice(7,11);

    if (EPAdate.slice(15) == 'PM' && EPAdate.slice(12,14) != '12') {
        hour = Number(EPAdate.slice(12,14)) + 12;
    } else if (EPAdate.slice(15) == 'AM' && EPAdate.slice(12,14) == '12'){
        hour = 0
    } else {
        hour = EPAdate.slice(12,14);
    }
    let date = new Date(year, month, day, hour)
    return date
}

export async function NWSHourlyUtil(regionData) {

    const forecastData = await MultiLoader(regionData.hourlyData.hourlyForecast)
    .then((response) => response.json())
    .then((responseJSON) => responseJSON.properties.periods)

    // First entry in these arrays has to be a label for Billboard.js API
    const forecastTime = ["x"];
    const temperatures = ["Temperature"];
    const dewpoints = ["Dewpoint"];
    const humidity = ["Humidity"];
    const precipProbs = ["Precip"];

    for (let i = 0; i < 108; i++) {
        temperatures.push(forecastData[i].temperature);
        dewpoints.push(forecastData[i].dewpoint.value * 1.8 + 32);
        humidity.push(forecastData[i].relativeHumidity.value);
        forecastTime.push(forecastData[i].endTime.slice(0,10) + " " + forecastData[i].endTime.slice(11,16));
        if (forecastData[i].probabilityOfPrecipitation.value == null) {
            precipProbs.push(0)
        } else {
            precipProbs.push(forecastData[i].probabilityOfPrecipitation.value)
        }
    }
    
    const temperatureCols = [forecastTime, temperatures, dewpoints]
    const percentCols = [forecastTime, humidity, precipProbs]

    return (
        {
            'temperatureCols': temperatureCols,
            'percentCols': percentCols
        }
    )
}

export async function EPAUVUtil(regionData) {
    const UVData = await MultiLoader(regionData.hourlyData.uvHourly)
    .then((response) => response.json())

    const UVTimes = ["x"];
    const UVIndex = ["UVI"];

    for (let i = 0; i < UVData.length; i++) {
        UVIndex.push(UVData[i].UV_VALUE)
        UVTimes.push(EPA2Date(UVData[i].DATE_TIME));
    }

    const UVCols = [UVTimes, UVIndex]

    return UVCols
}
