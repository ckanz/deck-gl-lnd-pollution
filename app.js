import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { csv } from "d3-request";

// TODO: load all pollutants
import csvFile from "./data/LAEI2016_2016_NO2-converted.csv";

// import 'semantic-ui-css/semantic.min.css' // TODO: which css-loader version to use of webpack4?
import { Menu, Checkbox, Dropdown } from "semantic-ui-react";
import { Heatmap } from "./Heatmap.js";

const aggregationMethods = [
  { key: "mean", text: "Mean", value: "MEAN" },
  { key: "min", text: "Min", value: "MIN" },
  { key: "max", text: "Max", value: "MAX" },
];

const pollutants = [{ key: "no2", text: "NO2", value: "NO2" }];

// TODO: add dropdown menu for different pollutants
const TopBarMenu = ({ opacityOn, setOpacityOn, setAggregation }) => (
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
        value="MEAN"
        selection
        options={aggregationMethods}
        onChange={(_, { value }) => {
          setAggregation(value);
        }}
      />
    </Menu.Item>
    <Menu.Item>
      <span style={{ marginRight: "10px" }}>Pollutant:</span>
      <Dropdown value="NO2" selection options={pollutants} />
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
  const [opacityOn, setOpacityOn] = useState(false);
  const [aggregation, setAggregation] = useState("MEAN");

  useEffect(() => {
    csv(csvFile, (error, data) => {
      if (error) {
        console.error(error);
        return;
      }
      setData(data);
    }).on("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded * 100) / event.total);
        console.log(percentComplete);
        setDataLoadingProgress(percentComplete);
      }
    });
  }, []);

  return (
    <>
      <Heatmap
        data={data}
        dataLoadingProgress={dataLoadingProgress}
        aggregation={aggregation}
        opacityOn={opacityOn}
      />
      <TopBarMenu
        opacityOn={opacityOn}
        setOpacityOn={setOpacityOn}
        setAggregation={setAggregation}
      />
    </>
  );
};

export const renderToDOM = (container) => {
  render(<App />, container);
};
