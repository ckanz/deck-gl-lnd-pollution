import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { csv } from "d3-request";

import no2PollutionData from "../data/LAEI2016_2016_NO2-converted.csv";
import noxPollutionData from "../data/LAEI2016_2016_NOx-converted.csv";
import pm10PollutionData from "../data/LAEI2016_2016_PM10-converted.csv";
import pm10dPollutionData from "../data/LAEI2016_2016_PM10d-converted.csv";
import pm25PollutionData from "../data/LAEI2016_2016_PM25-converted.csv";

import { DeckGLMap } from "./DeckGLMap.js";
import { TopBarMenu } from "./TopBarMenu.js";

const pollutants = [
  { key: "no2", text: "NO2", value: "NO2", data: no2PollutionData },
  { key: "nox", text: "NOx", value: "NOx", data: noxPollutionData },
  { key: "pm10", text: "PM10", value: "PM10", data: pm10PollutionData },
  { key: "pm10d", text: "PM10d", value: "PM10d", data: pm10dPollutionData },
  { key: "pm25", text: "PM2.5", value: "PM2.5", data: pm25PollutionData },
];

const mapTypes = [
  { key: "column", text: "Column", value: "ColumnLayer" },
  { key: "gridcell", text: "GridCell", value: "GridCellLayer" },
  { key: "screengrid", text: "ScreenGrid", value: "ScreenGridLayer" },
  { key: "heatmap", text: "Heatmap", value: "HeatmapLayer" },
];

const App = () => {
  const [dataMap, setDataMap] = useState({});
  const [dataLoadingProgress, setDataLoadingProgress] = useState(0);
  const [bytesLoaded, setBytesLoaded] = useState(0);
  const [opacityOn, setOpacityOn] = useState(false);
  const [aggregation, setAggregation] = useState("MEAN");
  const [pollutant, setPollutant] = useState("NO2");
  const [mapType, setMapType] = useState("HeatmapLayer");

  useEffect(() => {
    const loadedData = {};
    pollutants.forEach((pollutant) => {
      csv(pollutant.data, (error) => {
        if (error) {
          console.error(error);
          return;
        }
      })
        .on("progress", (event) => {
          setBytesLoaded(event.loaded);
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded * 100) / event.total
            );
            setDataLoadingProgress(percentComplete);
          }
        })
        .on("load", (data) => {
          loadedData[pollutant.value] = data;
          if (Object.keys(loadedData).length === pollutants.length) {
            setDataLoadingProgress(100);
            setTimeout(() => {
              setDataMap(loadedData);
            }, 250);
          }
        });
    });
  }, []);

  const currentData = dataMap[pollutant] || [];

  return (
    <>
      <DeckGLMap
        data={currentData}
        dataLoadingProgress={dataLoadingProgress}
        bytesLoaded={bytesLoaded}
        aggregation={aggregation}
        opacityOn={opacityOn}
        pollutant={pollutant}
        mapType={mapType}
      />
      <TopBarMenu
        opacityOn={opacityOn}
        setOpacityOn={setOpacityOn}
        aggregation={aggregation}
        setAggregation={setAggregation}
        pollutant={pollutant}
        setPollutant={setPollutant}
        mapType={mapType}
        setMapType={setMapType}
        pollutants={pollutants}
        mapTypes={mapTypes}
      />
    </>
  );
};

export const renderToDOM = (container) => {
  render(<App />, container);
};
