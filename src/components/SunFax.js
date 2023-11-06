import OSWindow from "./OSWindow";
import { MultiLoader } from '../utils/MultiLoader';
import React, { useState, useEffect, useRef } from 'react';
import "../css/SunFax.css";

function SunFax({ regionData, sunData }) {

    const [sunriseState, setSunrise] = useState(null);
    const [sunsetState, setSunset] = useState(null);
    const [daylightState, setDaylight] = useState(null);
    const [sunAngle, setSunAngle] = useState(null);
    const [maxUV, setMaxUV] = useState(null);

    async function getUV() {
        const forecastData = await MultiLoader(regionData.sunFaxData.uvDaily)
        .then((response) => response.json())
        .then((responseJSON) => responseJSON["0"].UV_INDEX)
        .then((UVData) => setMaxUV(String(UVData)))
    }

    useEffect(() => {
        if (sunData && regionData) {
            const {sunrise, sunset, daylight, maxSunAngle} = sunData;
            
            setSunrise(String(sunrise.getHours() + ":"
            + sunrise.getMinutes() + ":"
            + sunrise.getSeconds()));

            setSunset(String(sunset.getHours() + ":"
            + sunset.getMinutes() + ":"
            + sunset.getSeconds()));

            setDaylight(String(daylight.getUTCHours() + ":"
            + daylight.getUTCMinutes() + ":"
            + daylight.getUTCSeconds()));

            setSunAngle(String(maxSunAngle.toFixed(2) + '°'));
            getUV();
        }
    }, [regionData, sunData])

    return (
        <OSWindow className="SunFax" disableTaskbar={true} removePadding={true}>
            <table className="SunTable">
            <tr>
                <th className="PurpleFlashText Header" colspan="2">TODAY'S SUN FAX</th>
            </tr>
            <tr>
                <td className="Bold">SUNRISE</td>
                <td>{sunriseState ? sunriseState : 'coming soon'}</td>
            </tr>
            <tr>
                <td className="Bold">SUNSET</td>
                <td>{sunsetState ? sunsetState : 'real soon'}</td>
            </tr>
            <tr>
                <td className="Bold">LENGTH OF DAYLIGHT</td>
                <td>{daylightState ? daylightState : 'super soon'}</td>
            </tr>
            <tr>
                <td className="Bold">MAXIMUM SUN ALTITUDE</td>
                <td>{sunAngle ? sunAngle : 'super soon'}</td>
            </tr>
            <tr>
                <td className="Bold">TODAY'S MAX UV</td>
                <td>{maxUV ? maxUV : 'super soon'}</td>
            </tr>
            <tr>
                <td className="Bold SmallText" colspan="2">YOUR COMPUTER REALLY JUST CALCULATED THE ORBIT OF THE EARTH AND YOU DIDN'T EVEN SAY THANK YOU... SMH</td>
            </tr>
            </table>
        </OSWindow>
    )}

export default SunFax;