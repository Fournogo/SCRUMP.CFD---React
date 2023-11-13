import React, { useState, useEffect, useRef } from 'react';
import "../css/Animate.css";

function Animate({ images, 
    frameRate, 
    isAnimating, 
    setAnimating, 
    frameIncrement, 
    triggerIncrement, 
    frameRequest,
    delayArray,
    backgroundColor }) {

    const domRef = useRef(null);
    const imagesAreLoadedRef = useRef(false);
    const domImagesRef = useRef(null);
    const imageIndexRef = useRef(0);
    const timeoutRef = useRef(null);    

    function clearFrames() {
        domImagesRef.current.forEach((img, index) => {
            img.style.opacity = 0;
        });
    }

    function animate() {
        let delayMultiplier = 1
        // Set an interval to toggle image opacities

        if (imageIndexRef.current === 0) {
            domImagesRef.current[domImagesRef.current.length - 1].style.opacity = 0;
        }

        // If at last frame, switch to hold last frame function. Otherwise continue with the animation
        domImagesRef.current[imageIndexRef.current].style.opacity = 0;
        imageIndexRef.current = (imageIndexRef.current + 1) % domImagesRef.current.length;
        domImagesRef.current[imageIndexRef.current].style.opacity = 1;

        if (imageIndexRef.current === domImagesRef.current.length - 1) {
            delayMultiplier = 30;
            imageIndexRef.current = 0;
        }
        
        let delayFactor = (delayArray && delayArray[imageIndexRef.current]) !== undefined ? delayArray[imageIndexRef.current] : 1;
        timeoutRef.current = setTimeout(animate, (((1000 / frameRate) * delayMultiplier * delayFactor)))  // Adjust the interval time (in ms) as needed
    }

    // Loader responsible for adding images to the DOM
    useEffect(() => {
        if (domRef.current) {
            imagesAreLoadedRef.current = false;
            const parentDiv = domRef.current;
        
            // Clear any existing children in the parent div
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            
            // Append each image element to the parent div
            for (const imageElement of images) {
                imageElement.className = "AnimationImage";
                parentDiv.appendChild(imageElement);
            }

            imageIndexRef.current = 0;
            domImagesRef.current = Array.from(parentDiv.children);

            clearFrames();

            imagesAreLoadedRef.current = true; // Mark images as loaded
        }
    }, [images]);

    // Animator responsible for flipping through images when the animation is played
    useEffect(() => {

        if (imagesAreLoadedRef.current === true) {
            if (isAnimating === true) {
                if (imagesAreLoadedRef.current === true) {
                    animate();
                }
            };
        }

        // Optional: Clear the interval if component is unmounted
        return () => {
            clearTimeout(timeoutRef.current);
        };

    }, [imagesAreLoadedRef.current, isAnimating, frameRate, delayArray]);

    // Frame request logic for manually flipping through images
    useEffect(() => {
        if (frameRequest) {
            setAnimating(false);
            clearTimeout(timeoutRef.current);
            if (imagesAreLoadedRef.current === true) {
                clearFrames();
                domImagesRef.current[frameRequest].style.opacity = 1;
                imageIndexRef.current = frameRequest;
            }
        };
    }, [frameRequest])

    useEffect(() => {
        if (frameIncrement) {
            setAnimating(false);
            clearTimeout(timeoutRef.current);
            if (imagesAreLoadedRef.current === true) {
                clearFrames();

                imageIndexRef.current += frameIncrement;
                // Handle indicies that are too high or too low
                if (imageIndexRef.current < 0) {
                    imageIndexRef.current = domImagesRef.current.length - 1
                } else if (imageIndexRef.current > domImagesRef.current.length - 1) {
                    imageIndexRef.current = 0
                } else {
                    domImagesRef.current[imageIndexRef.current].style.opacity = 1;
                }
            }
        }
    }, [triggerIncrement])
    
    return (
        <div className={`AnimateContainer ${backgroundColor}`}>
        {images && (
        <div className="Animate" ref={ domRef }></div>
        )}
        </div>
    );
}

export default Animate;