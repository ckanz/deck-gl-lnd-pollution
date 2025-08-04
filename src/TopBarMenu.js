import React, { useEffect } from "react";
import { Menu, Checkbox, Dropdown } from "semantic-ui-react";

const aggregationMethodsHeatmap = [
  {
    key: "mean",
    text: "Mean",
    value: "MEAN",
    description: "The mean weight across all points that fall into a cell",
  },
  {
    key: "sum",
    text: "Sum",
    value: "SUM",
    description: "The sum of weights across all points that fall into a cell",
  },
];

const aggregationMethodsScreenGrid = [
  {
    key: "mean",
    text: "Mean",
    value: "MEAN",
    description: "The mean weight across all points that fall into a cell",
  },
  {
    key: "sum",
    text: "Sum",
    value: "SUM",
    description: "The sum of weights across all points that fall into a cell",
  },
  {
    key: "min",
    text: "Min",
    value: "MIN",
    description: "The minimum weight across all points that fall into a cell",
  },
  {
    key: "max",
    text: "Max",
    value: "MAX",
    description: "The maximum weight across all points that fall into a cell",
  },
  {
    key: "count",
    text: "Count",
    value: "COUNT",
    description: "The number of points that fall into a cell",
  },
];

export const TopBarMenu = ({
  opacityOn,
  setOpacityOn,
  setAggregation,
  aggregation,
  pollutant,
  setPollutant,
  mapType,
  setMapType,
  pollutants,
  mapTypes,
}) => {
  let aggregationMethods = [];
  switch (mapType) {
    case "HeatmapLayer":
      aggregationMethods = aggregationMethodsHeatmap;
      break;
    case "ScreenGridLayer":
      aggregationMethods = aggregationMethodsScreenGrid;
      break;
    case "GridLayer":
    case "ColumnLayer":
    case "GridCellLayer":
    default:
      aggregationMethods = [];
  }

  const disableItems = aggregationMethods.length === 0;

  return (
    <Menu style={{ position: "absolute", width: "100%", margin: 0 }}>
      <Menu.Item>
        <Checkbox
          disabled={disableItems}
          toggle
          label="show low emissions as transparent"
          onClick={() => {
            setOpacityOn(!opacityOn);
          }}
          checked={opacityOn}
        />
      </Menu.Item>

      <Menu.Item disabled={disableItems}>
        <span style={{ marginRight: "10px" }}>Aggregation Method:</span>
        <Dropdown
          disabled={disableItems}
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
      <Menu.Item>
        <span style={{ marginRight: "10px" }}>Map Type:</span>
        <Dropdown
          value={mapType}
          selection
          options={mapTypes}
          onChange={(_, { value }) => {
            setMapType(value);
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
};
