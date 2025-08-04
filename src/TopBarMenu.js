import React from "react";
import { Menu, Checkbox, Dropdown } from "semantic-ui-react";

const aggregationMethodsHeatmap = [
  {
    key: "mean",
    text: "Mean",
    value: "MEAN",
  },
  {
    key: "sum",
    text: "Sum",
    value: "SUM",
  },
];

const aggregationMethodsScreenGrid = [
  {
    key: "mean",
    text: "Mean",
    value: "MEAN",
  },
  {
    key: "sum",
    text: "Sum",
    value: "SUM",
  },
  {
    key: "min",
    text: "Min",
    value: "MIN",
  },
  {
    key: "max",
    text: "Max",
    value: "MAX",
  },
  {
    key: "count",
    text: "Count",
    value: "COUNT",
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
      <div style={{ textAlign: 'right', width: '100%', marginRight: '10px', marginTop: '10px', minWidth: '200px'
      }}>
        <div>
          Visualisation of the <a href="https://data.london.gov.uk/dataset/london-atmospheric-emissions-inventory--laei--2016/">London Atmospheric Emissions Inventory (LAEI)
          2016</a>.
        </div>
        <div>
          Find the project on GitHub{" "}
          <a href="https://github.com/ckanz/deck-gl-lnd-pollution">here</a>.
        </div>
      </div>
    </Menu>
  );
};
