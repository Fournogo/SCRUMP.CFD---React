import OSWindow from "./OSWindow";
import React, { useState, useEffect, useRef } from 'react';
import "../css/HourlyGraphs.css"; // Reuse some classes from here for now since they're almost the same
import BillboardChart from 'react-billboardjs';
import 'billboard.js/dist/billboard.css';
import generateShadedRegions from "../utils/ShadedRegions";
import {NDFDUtil} from "../utils/NDFDUtil";

function NDFDGraphs({ regionData, sunData }) {
    let shadedRegions;
    const widthThreshold = 927;
    const [cloudCoverOptions, setCloudCoverOptions] = useState(null);

    const windowProps = {
        disableTaskbar: true, 
        contentClassName: "HourlyGraph",
        title: "CLOUDZ.?",
        outerChildren: <><img src="/gifs/whitey.gif" className="WhiteCat"></img></>
    }

    async function initNDFDGraphs() {
        const {cloudCoverCols} = await NDFDUtil(regionData)
        const screenWidth = window.innerWidth;
        let showText
        if (screenWidth < widthThreshold) {
          showText = false
        } else {
          showText = true
        }
        setCloudCoverOptions({
            title: {
                text: "Estimated Percentage of Sky Covered by Clouds"
                },
            data: {
                x: "x",
                xLocaltime: true,
                xFormat: "%Y-%m-%d %H:%M",
                columns: cloudCoverCols,
                types: {
                    'Sky Cover': "line"
                },
                colors: {
                    'Sky Cover': "blue"
                }
            },
            axis: {
                y: {
                    max: 100,
                    min: 0,
                    tick: {
                        values: [0,10,20,30,40,50,60,70,80,90,100]
                    }
                    },
                x: {
                    type: "timeseries",
                    tick: {
                        format: function (x) {
                            let hours = x.getHours(); 
                            let ampm = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12;
                            let month = x.getMonth() + 1; // Get the month value (January is 0)
                            let date = x.getDate(); // Get the date value
                            return month + "-" + date + " " + hours + ":00 " + ampm;
                        },
                        text: {
                          show: showText
                        }
                    },
                }
                },
                regions: shadedRegions,
                grid: {
                y: {
                    show: true
                }
            }
            })
    }

    // Forecast data calls
    useEffect(() => {
        if (sunData && regionData) {
            shadedRegions = generateShadedRegions(sunData);
            initNDFDGraphs();
        }
      }, [regionData, sunData])

    return (
        <OSWindow {...windowProps}>
        <div className="GraphContainer">
        {(cloudCoverOptions) && (
                <BillboardChart 
                title={cloudCoverOptions.title} 
                data={cloudCoverOptions.data}
                axis={cloudCoverOptions.axis}
                regions={cloudCoverOptions.regions}
                grid={cloudCoverOptions.grid}
                />
        )}
      </div>
      </OSWindow>
    )}

export default NDFDGraphs;