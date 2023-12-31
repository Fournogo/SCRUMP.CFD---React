import React, { useState, useEffect, useRef } from 'react';
import Window from "../components/Window";
import "../css/Loading.css";

function Loading({ percent }) {

    let loadingMessage = "CONNECTING:"

    if (percent != 0) {
        loadingMessage = "LOADING:"
    }

    return (
        <>
        <Window className="LoadingWindowOuter">
            <Window className="LoadingWindow">
                <div className="DescriptionText1">THIS USUALLY WORKS BE PATIENT!!</div>
                <div className="DescriptionText2">IF WE DON'T LOAD THIS RIGHT YOU'LL HAVE A SEIZURE</div>
                
                {(percent) && (
                    <div className="LoadingText">{loadingMessage}<br></br>{percent}% COMPLETE</div>
                )}

                <div className="LoadingBar">
                    <div className="LoadingSpace">
                    {(percent) && (
                    <img className="NyanCat" style={{ left: percent + "%" }} src="/gifs/nyancat.gif"></img>
                    )}
                    </div>
                    <img className="HiddenNyanCat" src="/gifs/nyancat.gif"></img>
                </div>
            </Window>
        </Window>
        </>
    )
}

export default Loading;