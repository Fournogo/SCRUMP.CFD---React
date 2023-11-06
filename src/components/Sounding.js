import React, { useState, useEffect, useRef } from 'react';
import { MultiLoader } from '../utils/MultiLoader';
import OSWindow from './OSWindow';
import "../css/Sounding.css";

function Sounding({ regionData }) {

    const [soundingImage, setSoundingImage] = useState(null);

    const soundingURL = 'https://www.spc.noaa.gov';
    const soundingLocal = '/json/soundingLink.json';

    async function getSoundingLink() {
        const soundingImage = await MultiLoader(soundingLocal)
        .then((response) => response.json())
        .then((responseJSON) => setSoundingImage(String(soundingURL + responseJSON[regionData.soundingData.soundingCode])))
    }

    useEffect(() => {
        if (regionData) {
            getSoundingLink()
        }
    }, [regionData])

    const windowProps = {
        title: "RADIOSONDE.EXE",
        descriptionText: "A BALLOON DIED FOR THIS GRAPH",
        outerChildren: <><img className="SnailingCat" src="/gifs/snailing-cat.gif"></img></>
    }

    return (
        <OSWindow {...windowProps}>
        {soundingImage && (
            <img src={soundingImage} className="White InsetImage"></img>
        )}
        </OSWindow>
    )}

export default Sounding;