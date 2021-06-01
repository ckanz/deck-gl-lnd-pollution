import React from 'react'
import DeckGL from '@deck.gl/react'
import { render } from 'react-dom'
import { StaticMap } from 'react-map-gl'
import { HeatmapLayer, ScreenGridLayer } from '@deck.gl/aggregation-layers'
import { csv } from 'd3-request'
import { mapboxToken } from './creds.js'
import csvFile from './data/array.csv'

const INITIAL_VIEW_STATE = {
  longitude: -0.1,
  latitude: 51.5,
  zoom: 7.5,
  minZoom: 0,
  maxZoom: 15,
  pitch: 0,
  bearing: 0
}

const Heatmap =({ data }) => <DeckGL
  layers={[new HeatmapLayer({
    id: 'heatmap',
    data: data,
    getPosition: d => {
      return [Number(d.lon), Number(d.lat)]
    },
    getWeight: d => Number(d.conc),
    aggregation: 'MEAN',
    radiusPixels: 30,
    intensity: 1,
    threshold: 0.05
  })]}
  initialViewState={INITIAL_VIEW_STATE}
  controller
>
  <StaticMap
    reuseMaps
    mapStyle='mapbox://styles/mapbox/dark-v10'
    mapboxApiAccessToken={mapboxToken}
    preventStyleDiffing
  />
</DeckGL>

const ScreenGrid =({ data }) => <DeckGL
  layers={[new ScreenGridLayer({
      id: 'grid',
      data,
      opacity: 0.8,
      getPosition: d => [Number(d.lon), Number(d.lat)],
      getWeight: d => Number(d.conc),
      cellSizePixels: 10,
      gpuAggregation: true,
      aggregation: 'MEAN'
  })]}
  initialViewState={INITIAL_VIEW_STATE}
  controller
>
  <StaticMap
    reuseMaps
    mapStyle='mapbox://styles/mapbox/dark-v10'
    mapboxApiAccessToken={mapboxToken}
    preventStyleDiffing
  />
</DeckGL>

export const renderToDOM = container => {
  csv(csvFile, (error, data) => {
    if (error) {
      console.error(error)
      return
    }
    render(<ScreenGrid data={data} />, container)
  })
}
