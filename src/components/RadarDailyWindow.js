import "../css/DailyTable.css"
import OSWindow from "../components/OSWindow";
import DailyTable from "../components/DailyTable";
import DailyForecastUtil from "../utils/DailyForecastUtil";
import React, { useState, useEffect } from 'react';
import { PauseButton } from "../components/Buttons"

function RadarDailyWindow({ regionData }) {
    
    const [dailyForecastData, setDailyForecastData] = useState(null);
    const [dailyForecastLoading, setDailyForecastLoading] = useState(null);
    const [dailyForecastError, setDailyForecastError] = useState(null);

    const [radarGifStatic, setRadarGifStatic] = useState(null);
    const [radarGifLoop, setRadarGifLoop] = useState(null);
    const [radarPaused, setRadarPaused] = useState(false);

    const handlePausePlay = () => {
        setRadarPaused(prevState => !prevState);
    }

    useEffect(() => {
        async function fetchData() {
            setDailyForecastLoading(true);
            try {
                const result = await DailyForecastUtil(regionData);
                setDailyForecastData(result);
            } catch (err) {
                setDailyForecastError(err);
              } finally {
                setDailyForecastLoading(false); // Set loading to false once data fetching completes (whether it succeeds or fails)
              }
          }
          
          if (regionData) {
            fetchData();
            setRadarGifStatic(regionData.radarImage.radarLatestLink);
            setRadarGifLoop(regionData.radarImage.radarLoopLink);
          }

      }, [regionData]);

      const windowProps = {
        'title': 'FUTURE_PREDICTOR.EXE',
        'taskbarItems': [<PauseButton onClick={() => handlePausePlay()}> </PauseButton>,
        <a href="radar.weather.gov"><h3>CLICK HERE FOR MORE DETAILED RADAR!</h3></a>],
        'browserItems': [],
        'descriptionText': "DON'T BLAME THE MESSENGER!!",
        'outerChildren': <>
        <img className="ScratchCat" src="/gifs/scratchcat.gif"></img>
        <img className="DanceCat" src="/gifs/dancecat.gif"></img>
        </>,
        'contentClassName': "RadarHourlyContentResize"
    }

      return (
        <OSWindow { ...windowProps }>
            {(radarGifStatic && radarGifLoop) && (
                <div className="RadarBackground">
                    <div className="RadarContainer">
                    <img className="Radar" src={radarGifStatic}></img>
                    <img className={`Radar ${radarPaused ? 'Hidden' : ''}`} src={radarGifLoop}></img>
                    </div>
                </div>
            )}
            <div className="RadarSpacer"></div>
            {(dailyForecastData || dailyForecastError || dailyForecastLoading) && (
                <DailyTable data={ dailyForecastData } error = { dailyForecastError } loading = { dailyForecastLoading }/>
            )}
        </OSWindow>
      );
}

export default RadarDailyWindow;