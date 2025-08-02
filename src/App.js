import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { csv } from "d3-request";

import no2PollutionData from "../data/LAEI2016_2016_NO2-converted.csv";
import noxPollutionData from "../data/LAEI2016_2016_NOx-converted.csv";
import pm10PollutionData from "../data/LAEI2016_2016_PM10-converted.csv";
import pm10dPollutionData from "../data/LAEI2016_2016_PM10d-converted.csv";
import pm25PollutionData from "../data/LAEI2016_2016_PM25-converted.csv";

import { Menu, Checkbox, Dropdown } from "semantic-ui-react";
import { Heatmap } from "./Heatmap.js";

const aggregationMethods = [
  { key: "mean", text: "Mean", value: "MEAN" },
  { key: "sum", text: "Sum", value: "SUM" },
];

const pollutants = [
  { key: "no2", text: "NO2", value: "NO2", data: no2PollutionData },
  { key: "nox", text: "NOx", value: "NOx", data: noxPollutionData },
  { key: "pm10", text: "PM10", value: "PM10", data: pm10PollutionData },
  { key: "pm10d", text: "PM10d", value: "PM10d", data: pm10dPollutionData },
  { key: "pm25", text: "PM2.5", value: "PM2.5", data: pm25PollutionData },
];

const TopBarMenu = ({ opacityOn, setOpacityOn, setAggregation, aggregation, pollutant, setPollutant }) => (
  <Menu style={{ position: "absolute", width: "100%", margin: 0 }}>
    <Menu.Item>
      <Checkbox
        toggle
        label="show low emissions as transparent"
        onClick={() => {
          setOpacityOn(!opacityOn);
        }}
        checked={opacityOn}
      />
    </Menu.Item>
    <Menu.Item>
      <span style={{ marginRight: "10px" }}>Aggregation Method:</span>
      <Dropdown
        value={aggregation}
        selection
        options={aggregationMethods}
        onChange={(_, { value }) => {
          setAggregation(value);
        }}
      />
    </Menu.Item>
    <Menu.Item>
      <span style={{ marginRight: "10px" }}>Pollutant:</span>
      <Dropdown
        value={pollutant}
        selection
        options={pollutants}
        onChange={(_, { value }) => {
          setPollutant(value);
        }}
      />
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item>
        <span>
          Find the project on GitHub{" "}
          <a href="https://github.com/ckanz/deck-gl-lnd-pollution">here</a>.
        </span>
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

const App = () => {
  const [data, setData] = useState([]);
  const [dataLoadingProgress, setDataLoadingProgress] = useState(0);
  const [bytesLoaded, setBytesLoaded] = useState(0);
  const [opacityOn, setOpacityOn] = useState(false);
  const [aggregation, setAggregation] = useState("MEAN");
  const [pollutant, setPollutant] = useState("NO2");

  useEffect(() => {
    const dataMap = {}
    pollutants.forEach(pollutant => {
      csv(pollutant.data, (error, data) => {
        if (error) {
          console.error(error);
          return;
        }

        console.log(`Loaded ${pollutant.value} data`, data);
      }).on("progress", (event) => {
        console.log(`Loading ${pollutant.value} data: ${event.loaded} bytes`);
        setBytesLoaded(event.loaded);
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded * 100) / event.total);
          setDataLoadingProgress(percentComplete);
        }
      }).on("load", (data) => {
        console.log(`${pollutant.value} data loaded successfully`,data, dataMap);
        dataMap[pollutant.value] = data;
        if (Object.keys(dataMap).length === pollutants.length) {
          setData(dataMap[pollutant.value]);
          setDataLoadingProgress(100);
        }
      });
    });
  }, []);

  return (
    <>
      <Heatmap
        data={data}
        dataLoadingProgress={dataLoadingProgress}
        bytesLoaded={bytesLoaded}
        aggregation={aggregation}
        opacityOn={opacityOn}
        pollutant={pollutant}
      />
      <TopBarMenu
        opacityOn={opacityOn}
        setOpacityOn={setOpacityOn}
        aggregation={aggregation}
        setAggregation={setAggregation}
        pollutant={pollutant}
        setPollutant={setPollutant}
      />
    </>
  );
};

export const renderToDOM = (container) => {
  render(<App />, container);
};
