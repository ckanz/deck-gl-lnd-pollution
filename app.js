import React from 'react'
import DeckGL from '@deck.gl/react'
import { render } from 'react-dom'
import { StaticMap } from 'react-map-gl'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { csv } from 'd3-request'
import { mapboxToken } from './creds.js'
import csvFile from './data/array.csv'

const INITIAL_VIEW_STATE = {
  longitude: -0.1,
  latitude: 51.5,
  zoom: 11,
  minZoom: 10,
  maxZoom: 13,
  pitch: 0,
  bearing: 0
}

const colorRange = [
  [5, 255, 8, 20],
  [5, 217, 8, 50],
  [154, 178, 76, 100],
  [253, 141, 60, 150],
  [240, 59, 32, 182],
  [189, 0, 38, 200]
]

const Heatmap = ({ data }) => <DeckGL
  layers={[new HeatmapLayer({
    id: 'heatmap',
    data: data,
    getPosition: d => {
      return [Number(d.lon), Number(d.lat)]
    },
    colorRange,
    getWeight: d => Number(d.conc),
    aggregation: 'MEAN',
    radiusPixels: 50,
    intensity: 1,
    threshold: 0.03
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
    render(<Heatmap data={data} />, container)
  })
}
