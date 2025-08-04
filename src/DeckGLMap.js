import { HeatmapLayer, ScreenGridLayer } from "@deck.gl/aggregation-layers";
import { ColumnLayer, GridCellLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import React, { useEffect, useState } from "react";
import { default as StaticMap } from "react-map-gl";
import { Progress } from "semantic-ui-react";
import { mapboxToken } from "./creds";

const INITIAL_VIEW_STATE = {
  longitude: -0.1,
  latitude: 51.5,
  zoom: 13,
  minZoom: 9,
  maxZoom: 13,
};

const DefaultColorRange = [
  [5, 255, 8, 125],
  [5, 217, 8, 125],
  [154, 178, 76, 125],
  [253, 141, 60, 125],
  [240, 59, 32, 125],
  [189, 0, 38, 125],
];

const ColorRangeForFullOpacity = [
  [5, 255, 8, 25],
  [5, 217, 8, 25],
  [154, 178, 76, 25],
  [253, 141, 60, 150],
  [240, 59, 32, 150],
  [189, 0, 38, 150],
];

const getPosition = (d) => [Number(d.lon), Number(d.lat)];
const getWeight = (d) => Number(d.conc);
const getElevation = (d) => Number(d.conc) * 10.0;
const getFillColor = (d) => {
  const weight = getWeight(d);
  const colorIndex = Math.min(
    Math.floor(weight / 10),
    DefaultColorRange.length - 1
  );
  const finalColor = [
    ...(DefaultColorRange[colorIndex] || DefaultColorRange[0]),
  ];
  finalColor[3] = 50;
  return finalColor;
};

export const DeckGLMap = ({
  data,
  aggregation,
  opacityOn,
  dataLoadingProgress,
  bytesLoaded,
  mapType,
}) => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const colorRange = opacityOn ? ColorRangeForFullOpacity : DefaultColorRange;

    let layer;

    switch (mapType) {
      case "HeatmapLayer":
        layer = new HeatmapLayer({
          id: "heatmap",
          data: data,
          getPosition,
          radiusPixels: 50,
          colorRange,
          getWeight,
          aggregation,
        });
        break;

      case "GridCellLayer":
        layer = new GridCellLayer({
          id: "gridcell",
          data: data,
          getPosition,
          cellSize: 250,
          elevationScale: 4,
          getFillColor,
          getElevation,
        });
        break;

      case "ColumnLayer":
        layer = new ColumnLayer({
          id: "column",
          data: data,
          getPosition,
          radius: 100,
          elevationScale: 4,
          getFillColor,
          getElevation,
        });
        break;

      case "ScreenGridLayer":
        layer = new ScreenGridLayer({
          id: "screengrid",
          data: data,
          getPosition,
          cellSizePixels: 25,
          colorRange,
          getWeight,
          aggregation,
          opacity: 0.8,
        });
        break;

      default:
        layer = new HeatmapLayer({
          id: "heatmap",
          data: data,
          getPosition,
          radiusPixels: 50,
          colorRange,
          getWeight,
          aggregation,
        });
    }

    setLayers([layer]);
  }, [data, aggregation, opacityOn, mapType]);

  const isDataReady = data.length > 0;

  return (
    <>
      {!isDataReady && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            opacity: isDataReady ? 0 : 1,
          }}
        >
          <Progress percent={dataLoadingProgress} indicating progress />
          Loading data...
          <hr />
          <span>
            {bytesLoaded > 0 && `${(bytesLoaded / 1024).toFixed(2)} KB loaded`}
            {dataLoadingProgress > 0 && ` (${dataLoadingProgress}%)`}
          </span>
          <br />
        </div>
      )}
      {isDataReady && (
        <DeckGL
          layers={layers}
          initialViewState={INITIAL_VIEW_STATE}
          controller
        >
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxApiAccessToken={mapboxToken}
            preventStyleDiffing
          />
        </DeckGL>
      )}
    </>
  );
};
