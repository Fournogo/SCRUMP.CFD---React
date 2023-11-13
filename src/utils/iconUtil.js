const weatherIcons = {
    "Breezy": "/png/wind.png",
    "Rain": "/png/rain.png",
    "Rain Showers": "/png/rain.png",
    "Mostly Cloudy": "/png/part-sun.png",
    "Overcast": "/png/cloud.png",
    "Partly Cloudy": "/png/part-sun.png",
    "Increasing Clouds": "/png/cloud.png",
    "Light Rain": "/png/shower.png",
    "Light Rain Likely": "/png/shower.png",
    "Chance Light Rain": "/png/shower.png",
    "Chance Rain Showers": "/png/shower.png",
    "Chance Showers": "/png/shower.png",
    "T-storms": "/png/lightning.png",
    "Slight Chance Rain Showers": "/png/shower.png",
    "Mostly Sunny": "/png/part-sun.png",
    "Mostly Clear": "/png/part-moon.png",
    "Sunny": "/png/sun.png",
    "Clear": "/png/moon.png",
    "Partly Clear": "/png/part-moon.png",
    "Partly Sunny": "/png/part-sun.png",
    "Chance Rain/Snow": "/png/sleet.png",
    "Wintry Mix": "/png/sleet.png",
    "Chance Snow Showers": "/png/snow.png",
    "Snow Showers Likely": "/png/snow.png",
    "Snow Showers": "/png/snow.png",
    "Snow": "/png/snow.png",
    "Fog": "/png/fog.png",
    "Patch Fog": "/png/fog.png",
    "Fog/Mist": "/png/fog.png",
    "Sunny and Breezy": "/png/wind.png",
    "Cloudy and Breezy": "/png/wind.png",
    "Freezing Fog": "/png/fog.png",
    "Blowing Snow": "/png/snow.png",
    "Haze": "/png/haze.png",
    "Freezing Rain": "/png/sleet.png"
}

const keywordWeights = {
    "breezy": 8,
    "rain": 4,
    "sunny": 3,
    "partly": 1,
    "slight": 1,
    "showers": 1,
    "clear": 3,
    "clouds": 2,
    "cloudy": 2,
    "patchy": 1,
    "fog": 5,
    "snow": 8,
    "rain/snow": 3,
    "fog/mist": 5,
    "t-storms": 10,
    "freezing": 5,
    "slight": 1,
    "likely": 1,
    "chance": 1,
    "haze": 8,
}

function normalizeString(str) {
    return str.trim().toLowerCase();
}

function findIcon(forecastText) {
    if (weatherIcons[forecastText]) {
        return weatherIcons[forecastText];
    }

    let normalizedString = normalizeString(forecastText);
    let bestMatch = "";
    let highestScore = 0;

    for (let key in weatherIcons) {
        let normalizedKey = normalizeString(key);
        let score = 0;

        normalizedKey.split(" ").forEach(word => {
            console.log(word)
            if (normalizedString.includes(word)) {
                score += (keywordWeights[word] || 0);
                console.log(score)
            }
        });

        if (score > highestScore) {
            bestMatch = key;
            highestScore = score
        }
    }
    
    if (bestMatch) {
        return weatherIcons[bestMatch]
    }

}

export default findIcon;