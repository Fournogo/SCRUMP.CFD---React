import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import TopNavBar from "../components/TopNavBar";
import RadarDailyWindow from "../components/RadarDailyWindow";
import regions from '../json/regions.json';
import GoesImages from "../components/GoesImages";
import doSolarCalcs from "../utils/SolarCalcs";
import HourlyGraphs from "../components/HourlyGraphs"
import NDFDGraphs from "../components/NDFDGraphs"
import ModelData from "../components/ModelData"
import SunFax from "../components/SunFax"
import Sounding from "../components/Sounding"
import Label from "../components/Label"
import "../css/Weather.css";

function Weather() {

  const { regionName } = useParams();
  const [regionData, setRegionData] = useState(regions[regionName]); 
  const [sunData, setSunData] = useState(null);

  // Match the selected region to it's relevant data

  useEffect(() => {
      if (regions[regionName]) {
        setRegionData(regions[regionName]);
        if (regions[regionName].sunFaxData) {
          setSunData(doSolarCalcs(regions[regionName]));
        }
      }
  }, [regionName]);

  return (
    <>
    <TopNavBar items={['MusicNote', 'BackButton']} linkTo="/weather">
    </TopNavBar>

    <Label dimensions="WarningDimension">
      NOW 110% ZOOMABLE AND 69% MOBILE FRIENDLY!
    </Label>

    <Label dimensions="TopDimension">
    <img className="Lightning" src="/gifs/lightning.gif"></img>
    <img className="Scrump" src="/gifs/scrump-weather.gif"></img>
   </Label>

    {/* DAILY FORECAST AND RADAR DATA */}
    {regionData.dailyForecastData && (
        <RadarDailyWindow regionData={ regionData }/>
    )}

    {/* SUN DATA */}
    {regionData.sunFaxData && (
      <SunFax regionData={ regionData } sunData={ sunData }>
      </SunFax>
    )}

    {/* HOURLY DATA */}
    {(regionData.hourlyData && sunData) && (
      <HourlyGraphs regionData={ regionData } sunData={ sunData }>
      </HourlyGraphs>
    )}

    {/* GOES SATELLITE IMAGERY */}
    {regionData.goesData && (
      <>
      <Label>THIS AIN'T YA GRANDMA'S SATELLITE</Label>
      <GoesImages regionData={ regionData }/>
      </>
    )}

    {/* NOAA NDFD POINT FORECAST MODEL DATA */}
    {(regionData.hourlyData && sunData) && (
      <NDFDGraphs regionData={ regionData } sunData={ sunData }>
      </NDFDGraphs>
    )}

    {/* FORECAST MODEL GIS DATA */}
    {regionData.modelData && (
      <ModelData regionData={ regionData }>
        <div>model data</div>
      </ModelData>
    )}

    {/* SOUNDING DATA */}
    {regionData.soundingData && (
      <>
      <Label>HEY SIRI, WHAT'S A RADIOSONDE?</Label>
      <Sounding regionData={ regionData }>
      </Sounding>
      </>
    )}

  <div className="EndText">
  <img className="OprahCat" src="/gifs/banr_oprah.gif"></img>
  <h6>ALL DATA ON THIS WEBSITE IS PROVIDED FOR FREE BY VARIOUS DEPARTMENTS OF THE UNITED STATES GOVERNMENT.<br></br>I DO NOT CLAIM IT AS MY OWN AND DO NOT PRESENT THIS DATA WITH ANY WARRANTY OR REPRESENTATION.<br></br> HUGE THANKS TO NOAA, NWS, EPA, AND NASA!!! A PORTION OF THIS WORK USED CODE GENEROUSLY PROVIDED BY BRIAN BLAYLOCK'S HERBIE PYTHON PACKAGE!<br></br>MOBILE SUPPORT IS HAPPENING SLOWLY | CONTACT AVERY@SCRUMP.CFD WITH ISSUES</h6>
  </div>
  </>
  );
}

export default Weather;
