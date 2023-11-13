import "../css/DailyTable.css"
import React, { useState, useEffect } from 'react';

function DailyTable({ data, error, loading }) {
    /* Data input structure:
    const data = {
        "regionProperName": "...",
        "currentConditions": {
            "Temp": [ ... ],
            "Dew Point": [ ... ],
            "Precip Chance": [ ... ]
        },
        "forecastData": {
            "Timeframe": [ ... ],
            "Temp": [ ... ],
            "Dew Point": [ ... ],
            "Precip Chance": [ ... ]
        }
    }
    */
    // This function and an overly contrived one liner ensure any timeframe with "night" correctly shows the moon.
    // This saves from having to pass that data to the icon utility.
    function replaceSunWithMoon(str) {
        return str.includes('sun') ? str.replace('sun', 'moon') : str;
    }

    if ( error || loading ) {
        return (
            <table className="DailyTable">
                <thead>
                <tr className="PurpleFlashText Header">
                    <th colSpan="5">UHHHH WEATHER FORECAST</th>
                </tr>

                <tr>
                    <th>Timeframe</th>
                    <th>ICON</th>
                    <th>Temp</th>
                    <th>Dew Point</th>
                    <th>Precip Chance</th>
                </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 14 }).map((_, index) => (
                        <tr key={index}>
                            <td>UHHHH</td>
                            <td>UHHHH</td>
                            <td>UHHHH</td>
                            <td>UHHHH</td>
                            <td>UHHHH</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const {regionProperName, currentConditions, forecastData } = data

    if ( data  ) {
    return (
        <table className="DailyTable">
        <thead>
            <tr className="PurpleFlashText Header">
                <th colSpan="5">{ regionProperName.toUpperCase() } WEATHER FORECAST</th>
            </tr>

            <tr>
                <th>Timeframe</th>
                <th>ICON</th>
                <th>Temp</th>
                <th>Dew Point</th>
                <th>Precip Chance</th>
            </tr>
        </thead>
        <tbody>
            <tr className="FirstRow">
                <td className="PurpleFlashText">CURRENTLY</td>
                <td><div className="IconCell"><img className="Icon" src={forecastData.Timeframe[0].toLowerCase().includes('night') ? replaceSunWithMoon(currentConditions['Icons'][0]) : currentConditions['Icons'][0] }></img></div></td>
                <td>{currentConditions['Temp']}</td>
                <td>{currentConditions['Dew Point']}</td>
                <td>{currentConditions['Precip Chance']}</td>
            </tr>

            {forecastData.Timeframe.map((timeframe, index) => (
                        <tr key={index}>
                            <td>{timeframe}</td>
                            <td><div className="IconCell"><img className="Icon" src={timeframe.toLowerCase().includes('night') ? replaceSunWithMoon(forecastData['Icons'][index]) : forecastData['Icons'][index] }></img></div></td>
                            <td style={{ color: timeframe.toLowerCase().includes('night') ? 'blue' : 'red' }}>{forecastData['Temp'][index]}</td>
                            <td>{forecastData['Dew Point'][index]}</td>
                            <td>{forecastData['Precip Chance'][index]}</td>
                        </tr>
                    ))}
        </tbody>
        </table>
    )};
}

export default DailyTable;