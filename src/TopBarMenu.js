import React from "react";
import { Menu, Checkbox, Dropdown } from "semantic-ui-react";

const aggregationMethodsHeatmap = [
  {
    key: "mean",
    text: "Mean",
    value: "MEAN",
    description: "Mean weight across all points in a cell",
  },
  {
    key: "sum",
    text: "Sum",
    value: "SUM",
    description: "Sum of weights across all points in a cell",
  },
];

const aggregationMethodsScreenGrid = [
  {
    key: "mean",
    text: "Mean",
    value: "MEAN",
    description: "Mean weight across all points in a cell",
  },
  {
    key: "sum",
    text: "Sum",
    value: "SUM",
    description: "Sum of weights across all points in a cell",
  },
  {
    key: "min",
    text: "Min",
    value: "MIN",
    description: "Minimum weight across all points in a cell",
  },
  {
    key: "max",
    text: "Max",
    value: "MAX",
    description: "Maximum weight across all points in a cell",
  },
  {
    key: "count",
    text: "Count",
    value: "COUNT",
    description: "Number of points in a cell",
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
        <span style={{ marginRight: 10 }}>Aggregation Method:</span>
        <Dropdown
          style={{ width: 350 }}
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
        <span style={{ marginRight: 10 }}>Pollutant:</span>
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
        <span style={{ marginRight: 10 }}>Map Type:</span>
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
