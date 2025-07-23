import { ScreenGridLayer, HeatmapLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import { scaleLinear } from "d3-scale";
import React, { useState } from "react";
import { default as StaticMap } from "react-map-gl";
import { mapboxToken } from "./creds";

export const Heatmap = ({ data, aggregation, opacityOn, dataLoadingProgress }) => {
  const INITIAL_VIEW_STATE = {
    longitude: -0.1,
    latitude: 51.5,
    zoom: 13,
    minZoom: 9,
    maxZoom: 13,
    pitch: 0,
    bearing: 0,
  };

  const defaultColorRange = [
    [5, 255, 8, 175],
    [5, 217, 8, 175],
    [154, 178, 76, 175],
    [253, 141, 60, 175],
    [240, 59, 32, 175],
    [189, 0, 38, 175],
  ];

  const colorRangeForFullOpacity = [
    [5, 255, 8, 50],
    [5, 217, 8, 50],
    [154, 178, 76, 50],
    [253, 141, 60, 175],
    [240, 59, 32, 175],
    [189, 0, 38, 175],
  ];

  const gridOpacityScale = scaleLinear()
    .domain([10, 12])
    .range([1, 0])
    .clamp(true);
  const heatmapOpacityScale = scaleLinear()
    .domain([10, 12])
    .range([0, 1])
    .clamp(true);

  const [gridOpacity, setGridOpacity] = useState(
    gridOpacityScale(INITIAL_VIEW_STATE.zoom)
  );
  const [heatmapOpacity, setHeatmapOpacity] = useState(
    heatmapOpacityScale(INITIAL_VIEW_STATE.zoom)
  );

  const colorRange = opacityOn ? colorRangeForFullOpacity : defaultColorRange;

  const getPosition = (d) => [Number(d.lon) - 0.00, Number(d.lat) + 0.00];
  const getWeight = (d) => Number(d.conc);

  const screenGridLayer = new ScreenGridLayer({
    id: "screen-grid-layer",
    data,
    pickable: false,
    cellSizePixels: 10,
    cellMarginPixels: 30,
    opacity: gridOpacity,
    colorRange,
    getPosition,
    getWeight,
    aggregation,
  });

  const heatmapLayer = new HeatmapLayer({
    id: "heatmap",
    data: data,
    opacity: heatmapOpacity,
    getPosition,
    radiusPixels: 50,
    colorRange,
    getWeight,
    aggregation,
  });

  const layers = [screenGridLayer, heatmapLayer];
  const isDataReady = data.length > 0;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          opacity: isDataReady ? 0 : 1,
        }}
      >
        loading... {dataLoadingProgress}%
      </div>
      <div style={{ opacity: isDataReady ? 1 : 0 }}>
        <DeckGL
          layers={layers}
          initialViewState={INITIAL_VIEW_STATE}
          onViewStateChange={({ viewState }) => {
            setGridOpacity(gridOpacityScale(viewState.zoom));
            setHeatmapOpacity(heatmapOpacityScale(viewState.zoom));
          }}
          controller
        >
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
            mapboxApiAccessToken={mapboxToken}
            preventStyleDiffing />
        </DeckGL>
      </div>
    </>
  );
};
