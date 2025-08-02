import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import React, { useEffect } from "react";
import { default as StaticMap } from "react-map-gl";
import { Progress } from "semantic-ui-react";
import { mapboxToken } from "./creds";

export const Heatmap = ({
  data,
  aggregation,
  opacityOn,
  dataLoadingProgress,
  bytesLoaded,
}) => {
  const INITIAL_VIEW_STATE = {
    longitude: -0.1,
    latitude: 51.5,
    zoom: 13,
    minZoom: 9,
    maxZoom: 13,
  };

  const defaultColorRange = [
    [5, 255, 8, 125],
    [5, 217, 8, 125],
    [154, 178, 76, 125],
    [253, 141, 60, 125],
    [240, 59, 32, 125],
    [189, 0, 38, 125],
  ];

  const colorRangeForFullOpacity = [
    [5, 255, 8, 50],
    [5, 217, 8, 50],
    [154, 178, 76, 50],
    [253, 141, 60, 150],
    [240, 59, 32, 150],
    [189, 0, 38, 150],
  ];

  const [layers, setLayers] = React.useState([]);

  const colorRange = opacityOn ? colorRangeForFullOpacity : defaultColorRange;

  const getPosition = (d) => [Number(d.lon) - 0.0, Number(d.lat) + 0.0];
  const getWeight = (d) => Number(d.conc);

  useEffect(() => {
    const heatmapLayer = new HeatmapLayer({
      id: "heatmap",
      data: data,
      getPosition,
      radiusPixels: 50,
      colorRange,
      getWeight,
      aggregation,
    });
    setLayers([heatmapLayer]);
  }, [data, aggregation, opacityOn]);

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
