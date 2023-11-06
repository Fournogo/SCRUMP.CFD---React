import { MultiLoader } from '../utils/MultiLoader';

export async function NDFDUtil(regionData) {
    const NDFDPath = '/json/cloudCoverData.json'

    const cloudCoverRawData = await MultiLoader(NDFDPath)
    .then((response) => response.json())
    .then((responseJSON) => responseJSON[regionData.name])

    const cloudCover = ["Sky Cover"];
    const forecastTime = ["x"];

    for (let i = 0; i < 36; i++) {
        cloudCover.push(cloudCoverRawData[i][1]);
        forecastTime.push(cloudCoverRawData[i][0].slice(0,10) + " " + cloudCoverRawData[i][0].slice(11,16));
    }

    const cloudCoverCols = [forecastTime, cloudCover]
    
    return (
        {
            'cloudCoverCols': cloudCoverCols
        }
    )
}