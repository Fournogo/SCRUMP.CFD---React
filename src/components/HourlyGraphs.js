import OSWindow from "./OSWindow";
import React, { useState, useEffect, useRef } from 'react';
import {NWSHourlyUtil, EPAUVUtil} from "../utils/HourlyGraphsUtil";
import "../css/HourlyGraphs.css";
import generateShadedRegions from "../utils/ShadedRegions";

import BillboardChart from 'react-billboardjs';
import 'billboard.js/dist/billboard.css';

function HourlyGraphs({ regionData, sunData }) {
    let shadedRegions;
    const widthThreshold = 927;

    const [TemperatureOptions, setTemperatureOptions] = useState(null);
    const [PercentOptions, setPercentOptions] = useState(null);
    const [UVOptions, setUVOptions] = useState(null);

    async function initNWSGraphs() {
      const {temperatureCols, percentCols} = await NWSHourlyUtil(regionData)
      const screenWidth = window.innerWidth;
        let showText
        if (screenWidth < widthThreshold) {
          showText = false
        } else {
          showText = true
        }
      setTemperatureOptions(
        {
          title: {
              text: "Estimated Hourly Temperature and Dewpoint"
            },
          data: {
              x: "x",
              xLocaltime: true,
              xFormat: "%Y-%m-%d %H:%M",
              columns: temperatureCols,
              types: {
                Temperature: "line",
                Dewpoint: "line"
              },
              colors: {
                Temperature: "red",
                Dewpoint: "green"
              }
          },
          axis: {
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
                }
              }
            },
          regions: shadedRegions,
          grid: {
              y: {
                show: true
              }
          }
      })
      
      setPercentOptions(
        {
          title: {
              text: "Estimated Probability of Precipitation & Relative Humdity"
            },
          data: {
              x: "x",
              xLocaltime: true,
              xFormat: "%Y-%m-%d %H:%M",
              columns: percentCols,
              types: {
                  Humidity: "line",
                  Precip: "line"
              },
              colors: {
                  Humidity: "green",
                  Precip: "blue"
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

      async function initUVGraph() {
        const UVCols = await EPAUVUtil(regionData)
        const screenWidth = window.innerWidth;
        let showText
        if (screenWidth < widthThreshold) {
          showText = false
        } else {
          showText = true
        }
        setUVOptions(
          {
            title: {
                text: "Estimated UV Index"
              },
            data: {
                x: "x",
                xLocaltime: true,
                xFormat: "%Y-%m-%d %H:%M",
                columns: UVCols,
                types: {
                    UVI: "line",
                },
                colors: {
                    UVI: "red"
                }
            },
            axis: {
                y: {
                    max: 13,
                    min: 0,
                    tick: {
                        values: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
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
                    }
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
        initNWSGraphs();
        initUVGraph();
      }
    }, [regionData, sunData])

    const windowProps = {
      'title': 'HOURLY_CHART.PRG',
      'outerChildren': <>
      <img className="RedCat" src="/gifs/3d-sitting-cat.gif"></img>
      </>,
      'removePadding': true
  }

    return (
    <OSWindow {...windowProps} disableTaskbar={true} contentClassName="HourlyGraph">
      <div className="GraphContainer">
      {(TemperatureOptions) && (
                <BillboardChart 
                title={TemperatureOptions.title} 
                data={TemperatureOptions.data}
                axis={TemperatureOptions.axis}
                regions={TemperatureOptions.regions}
                grid={TemperatureOptions.grid}
                />
      )}
      </div>
      <div className="GraphContainer">
      {(PercentOptions) && (
                <BillboardChart 
                title={PercentOptions.title} 
                data={PercentOptions.data}
                axis={PercentOptions.axis}
                regions={PercentOptions.regions}
                grid={PercentOptions.grid}/>
      )}
      </div>
      <div className="GraphContainer">
      {(UVOptions) && (
                <BillboardChart 
                title={UVOptions.title} 
                data={UVOptions.data}
                axis={UVOptions.axis}
                regions={UVOptions.regions}
                grid={UVOptions.grid}/>
      )}
      </div>
    </OSWindow>
    );
}

export default HourlyGraphs;