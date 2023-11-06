import OSWindow from "../components/OSWindow";
import React, { useState, useEffect, useRef } from 'react';
import "../css/GoesImages.css";
import GoesUtil from "../utils/GoesUtil";
import Animate from "../components/Animate";
import Goes from '../json/goes.json';
import {PauseButton, BrowserButton, NextButton, BackButton } from "../components/Buttons";
import Loading from "../components/Loading";

function initSource(regionData) {

    const startingHours = 8
    const goesCode = regionData.goesData.goesCode

    return (
        {
            "numImages": (startingHours * 12),
            "goesCode": goesCode,
            "goesJson": Goes[goesCode].goesJson,
            "goesLink": Goes[goesCode].goesLink,
            "goesResolution": Goes[goesCode].goesResolution
        }
    );
}

function GoesImages({ regionData }) {

    const browserDescriptionLine1 = "GOES 18 and GOES 16 are a pair of meteorological satellites launched as a joint effort between NASA and NOAA. They constantly beam down images of Earth's surface and the Sun in various bands corresponding to different wavelengths of light. Both satellites are located in geostationary orbit 22,236 miles above the equator. GOES 16 is located above Ecuador, while GOES 18 is located above the central pacific."
    const browserDescriptionLine2 = "Both satellites image the entire continental US every 5 minutes, which is why the images you see here are every 5 minutes. They're usually delayed by up to 15 minutes so these pictures are pretty live!"

    const [goesImages, setGoesImages] = useState(null);
    const [goesImagesIsLoading, setGoesImagesIsLoading] = useState(null);
    const [goesImagesLoadingPercent, setGoesImagesLoadingPercent] = useState(0);
    const [goesImagesSource, setGoesImagesSource] = useState(initSource(regionData));
    const [goesImagesError, setGoesImagesError] = useState(null);
    const [goesFrameRequest, setGoesFrameRequest] = useState(null);
    const [goesFrameRate, setGoesFrameRate] = useState(15);
    const [goesIsAnimating, setGoesIsAnimating] = useState(null);
    const [goesTriggerIncrement, setGoesTriggerIncrement] = useState(null);

    const frameIncrementRef = useRef(null); 

    const handleFrameRateChange = (frameRate) => {
        setGoesFrameRate(Number(frameRate))
    }
 
    const handleSliderChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setGoesFrameRequest(newValue);
    };

    const handlePausePlay = () => {
        setGoesIsAnimating(prevState => !prevState);
    };

    const handleIncrement = () => {
        frameIncrementRef.current = 1
        setGoesTriggerIncrement(prevState => !prevState);
    }

    const handleDecrement = () => {
        frameIncrementRef.current = -1
        setGoesTriggerIncrement(prevState => !prevState);
    }

    const handleNumImageChange = (newNumImages) => {
        setGoesImagesSource(prevData => ({
            ...prevData,
            numImages: newNumImages
        }));
    };

    const handleGoesCodeChange = (newGoesCode) => {
        console.log(newGoesCode)
        setGoesImagesSource(prevData => ({
            ...prevData,
            goesCode: newGoesCode,
            goesJson: Goes[newGoesCode].goesJson,
            goesLink: Goes[newGoesCode].goesLink
        }));
    };

    const optionElements = Object.entries(Goes).map(([key, { properName }]) => (
        <option key={key} value={key}>{properName}</option>
    ));

    const updateMaxValue = (newMax) => {
        setWindowProps(prevState => ({
          ...prevState,
          browserItems: prevState.browserItems.map(item => {
            // Assuming the input element is always at a certain index, e.g., 0
            if (React.isValidElement(item) && item.props.type === 'range') {
              // Clone the element with the new prop
              return React.cloneElement(item, { max: newMax });
            }
            return item;
          })
        }));
      };

    const [windowProps, setWindowProps] = useState({
        'title': 'SPY_SAT.EXE',
        'taskbarItems': [<BackButton onClick={() => handleDecrement()}></BackButton>,
        <PauseButton onClick={() => handlePausePlay()}></PauseButton>,
        <NextButton onClick={() => handleIncrement()}></NextButton>,
        <BrowserButton/>],
        'browserItems': [
        <h3 className="Gray">REGION SELECTOR</h3>,
        <select onChange={(e) => handleGoesCodeChange(e.target.value)}>
        {optionElements}
        </select>,
        <h3 className="Gray">TIME SELECTOR</h3>,
        <select onChange={(e) => handleNumImageChange(e.target.value)}>
        <option value="48">Previous 4 hours</option>
        <option value="96">Previous 8 hours</option>
        <option value="144">Previous 12 hours</option>
        <option value="192">Previous 16 hours</option>
        <option value="240">Previous 20 hours</option>
        <option value="288">Previous 24 hours</option>
        </select>,
        <h3 className="Gray">FRAME RATE SELECTOR</h3>,
        <select onChange={(e) => handleFrameRateChange(e.target.value)}>
        <option value="5">5 fps</option>
        <option value="10">10 fps</option>
        <option value="15">15 fps</option>
        <option value="20">20 fps</option>
        <option value="25">25 fps</option>
        <option value="30">30 fps</option>
        </select>,
        <h3 className="Gray">FRAME SELECTOR</h3>,
        <input 
        className="FrameSlider"
        type="range" 
        min="0" 
        max="95"
        value={goesFrameRequest} 
        onChange={handleSliderChange}
        style={{ zIndex: 5000 }}/>,
        <h2 className="BrowserDescription">{browserDescriptionLine1}<br></br><br></br>{browserDescriptionLine2}</h2>
        ],
        'descriptionText': 'WHO SPYING ON WHO???',
        'outerChildren': <><img src="/gifs/laycat.gif" className="LayCat"></img></>
    })

    useEffect(() => {
    async function fetchData() {
        setGoesImages(null);
        setGoesImagesIsLoading(true);
        try {
            const result = await GoesUtil(goesImagesSource, (percentComplete) => {
                setGoesImagesLoadingPercent(percentComplete);
            });
            setGoesImages(result);
            updateMaxValue(result.length - 1);
            setGoesIsAnimating(true);
        } catch (err) {
            setGoesImagesError(err);
        } finally {
            setGoesImagesIsLoading(false); // Set loading to false once data fetching completes (whether it succeeds or fails)
      }
    }
    fetchData();
    }, [goesImagesSource]);

    return (
        <>
        {windowProps && (
        <OSWindow {...windowProps}>
        <>
            {(goesImagesLoadingPercent && goesImagesIsLoading) && (
                <Loading percent={goesImagesLoadingPercent}></Loading>
            )}
        </>
        {(goesImages || goesFrameRequest || goesIsAnimating || goesTriggerIncrement || goesFrameRate) && (
            <div onClick={() => handleIncrement()} className="HiddenButton">
            <Animate images={goesImages} 
            isAnimating={goesIsAnimating} 
            setAnimating={setGoesIsAnimating} 
            frameIncrement={frameIncrementRef.current} 
            triggerIncrement={goesTriggerIncrement} 
            frameRate={goesFrameRate} 
            frameRequest={goesFrameRequest}/>
            </div>
        )}
      </OSWindow>
      )}
      </>
    )};

export default GoesImages;