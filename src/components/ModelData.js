import OSWindow from "../components/OSWindow";
import React, { useState, useEffect, useRef } from 'react';
import "../css/ModelData.css";
import ModelUtil from "../utils/ModelUtil";
import Animate from "../components/Animate";
import menuItems from '../json/modelDataMenu.json';
import Loading from "../components/Loading";
import {PauseButton, BrowserButton, NextButton, BackButton } from "../components/Buttons";

function initSource(regionData) {

    const regionCode = regionData.modelData.modelState

    return (
        {
            "modelCode": "hrrr",
            "subsetCode": "subh",
            "productCode": "refd1000m",
            "regionCode": regionCode,
        }
    );
}

function generateMenu(dataObj, source, helperFunctions) {

    const selects = [];

    for (const key in dataObj) {
        const selection = source[key]

        const options = dataObj[key].map(value => {
            return (
                <option value={value} key={value} selected={selection === value}>
                    {menuItems[value] || value}
                </option>
            );
        });

        const selectElement = (
            <select key={key} onChange={(e) => helperFunctions[key](e.target.value)}>
                {options}
            </select>
        );

        selects.push(selectElement);
    }

    return selects;
}

function ModelData({ regionData }) {

    const browserDescriptionLine1 = "The high-resolution Rapid Refresh (HRRR) operates at a 3km resolution, while the GFS operates at 18km. GFS output is \"contoured\" to provide a smoother look but it's still quite rough. GFS data is best used for identifying trends at a synoptic scale. (Think large scale, though that's not really what synoptic means.) HRRR data allows for more local analysis, but it's always worth remembering weather (literally) doesn't occur in a vacuum. As such these models will NEVER be exactly right, but they'll hopefully be close!"

    const [images, setImages] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [imageSource, setImageSource] = useState(initSource(regionData));
    const [loadError, setLoadError] = useState(null);
    const [frameRequest, setFrameRequest] = useState(null);
    const [frameRate, setFrameRate] = useState(15);
    const [isAnimating, setIsAnimating] = useState(null);
    const [triggerIncrement, setTriggerIncrement] = useState(null);

    const [browserButtons, setBrowserButtons] = useState(null);
    const [windowProps, setWindowProps] = useState(null);

    const frameIncrementRef = useRef(null);

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

    const handleFrameRateChange = (frameRate) => {
        setFrameRate(Number(frameRate))
    }
 
    const handleSliderChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setFrameRequest(newValue);
    };

    const handlePausePlay = () => {
        setIsAnimating(prevState => !prevState);
    };

    const handleIncrement = () => {
        frameIncrementRef.current = 1
        setTriggerIncrement(prevState => !prevState);
    }

    const handleDecrement = () => {
        frameIncrementRef.current = -1
        setTriggerIncrement(prevState => !prevState);
    }

    const helperFunctions = {
        'modelCode': function handleModelCodeChange(newCode) {
            setImageSource(prevData => ({
                ...prevData,
                modelCode: newCode
            }));
        },
        'subsetCode': function handleSubsetCodeChange(newCode) {
            setImageSource(prevData => ({
                ...prevData,
                subsetCode: newCode
            }));
        },
        'productCode': function handleProductCodeChange(newCode) {
            setImageSource(prevData => ({
                ...prevData,
                productCode: newCode
            }));
        },
        'regionCode': function handleRegionCodeChange(newCode) {
            setImageSource(prevData => ({
                ...prevData,
                regionCode: newCode
            }));
        },
    }
    

    useEffect(() => {
    async function fetchData() {
        setImages(null);
        setIsLoading(true);
        try {
            const {imageArray, dataStructure} = await ModelUtil(imageSource, (percentComplete) => {
                setLoadingPercent(percentComplete);
            });
            setBrowserButtons(generateMenu(dataStructure, imageSource, helperFunctions));
            setImages(imageArray);
            if (windowProps) {
                updateMaxValue(imageArray.length - 1);
            }
            setIsAnimating(true);
        } catch (err) {
            setLoadError(err);
        } finally {
            setIsLoading(false); // Set loading to false once data fetching completes (whether it succeeds or fails)
      }
    }
    fetchData();
    }, [imageSource]);

    useEffect(() => {
        if (browserButtons) {
        setWindowProps({
            'title': 'FUTURE_PREDICTOR.EXE',
            'taskbarItems': [<BackButton onClick={() => handleDecrement()}></BackButton>,
            <PauseButton onClick={() => handlePausePlay()}></PauseButton>,
            <NextButton onClick={() => handleIncrement()}></NextButton>,
            <BrowserButton/>],
            'browserItems': [<h3 className="Gray">MODEL SELECTOR</h3>, browserButtons[0],
            <h3 className="Gray">SUBSET SELECTOR</h3>, browserButtons[1],
            <h3 className="Gray">PRODUCT SELECTOR</h3>, browserButtons[2],
            <h3 className="Gray">REGION SELECTOR</h3>, browserButtons[3],
            <h3 className="Gray">FRAME SELECTOR</h3>,
            <input 
            className="FrameSlider"
            type="range" 
            min="0" 
            max="71"
            value={frameRequest} 
            onChange={handleSliderChange}
            style={{ zIndex: 5000 }}/>,
            <h3 className="Gray">FRAME RATE SELECTOR</h3>,
            <select onChange={(e) => handleFrameRateChange(e.target.value)}>
            <option value="5">5 fps</option>
            <option value="10">10 fps</option>
            <option value="15">15 fps</option>
            <option value="20">20 fps</option>
            <option value="25">25 fps</option>
            <option value="30">30 fps</option>
            </select>,
            <h2 className="BrowserDescription">{browserDescriptionLine1}</h2>,],
            'descriptionText': 'TRIPPY COLORS!!'
        })
    }
    }, [browserButtons])

    return (
        <OSWindow {...windowProps}>
        <>
            {(loadingPercent && isLoading) && (
                <Loading percent={loadingPercent}></Loading>
            )}
        </>
        {(images || frameRequest || isAnimating || triggerIncrement || frameRate) && (
            <>
            <Animate images={images} 
            isAnimating={isAnimating} 
            setAnimating={setIsAnimating} 
            frameIncrement={frameIncrementRef.current} 
            triggerIncrement={triggerIncrement} 
            frameRate={frameRate} 
            frameRequest={frameRequest}
            backgroundColor={"White"}/>
            </>
        )}
      </OSWindow>
    )};

export default ModelData;