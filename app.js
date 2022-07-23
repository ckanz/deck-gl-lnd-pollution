import React, { useState } from 'react'
import DeckGL from '@deck.gl/react'
import { render } from 'react-dom'
import { StaticMap } from 'react-map-gl'
import { HeatmapLayer, ScreenGridLayer } from '@deck.gl/aggregation-layers'
import { csv } from 'd3-request'
import { mapboxToken } from './creds.js'
import csvFile from './data/array.csv'

// import 'semantic-ui-css/semantic.min.css' // TODO: which css-loader version to use of webpack4?
import { Input, Menu, Checkbox } from 'semantic-ui-react'

const INITIAL_VIEW_STATE = {
  longitude: -0.1,
  latitude: 51.5,
  zoom: 11,
  minZoom: 7,
  maxZoom: 14.5,
  pitch: 0,
  bearing: 0
}

const colorRange = [
  [5, 255, 8, 50],
  [5, 217, 8, 100],
  [154, 178, 76, 150],
  [253, 141, 60, 175],
  [240, 59, 32, 182],
  [189, 0, 38, 200]
]

const colorRangeNoOpac = [
  [5, 255, 8, 0],
  [5, 217, 8, 0],
  [154, 178, 76, 0],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38]
]

const getLatLonArray = d => [Number(d.lon) - 0.002, Number(d.lat) + 0.001]

const Heatmap = ({ data }) => {
  const [pointSize, setPointSize] = useState(50)
  const [gridOpacity, setGridOpacity] = useState(1)
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.3)
  const [colorScheme, setColorScheme] = useState(colorRange)

const MenuExampleInputs = () => (
  <Menu vertical style={{ position: 'absolute', width: '100%', margin: 0 }}>
    <Menu.Item>
      <Checkbox toggle label='show low emissions as transparent' onClick={toggleOpacity} checked={colorScheme == colorRangeNoOpac} />
    </Menu.Item>
  </Menu>
)


  const screengridLayer = new ScreenGridLayer({
    id: 'screen-grid-layer',
    data,
    pickable: false,
    cellSizePixels: 10,
    cellMarginPixels: 30,
    opacity: gridOpacity,
    // opacity: 0.5,
    colorRange: colorScheme,
    // colorRange: colorRange,
    getPosition: d => getLatLonArray(d),
    getWeight: d => Number(d.conc),
    aggregation: 'MEAN'
  })

  const heatmapLayer = new HeatmapLayer({
    id: 'heatmap',
    data: data,
    opacity: heatmapOpacity,
    // opacity: 0.5,
    getPosition: d => getLatLonArray(d),
    radiusPixels: pointSize,
    colorRange: colorScheme,
    // colorRange: colorRange,
    getWeight: d => Number(d.conc),
    aggregation: 'MEAN'
  })

  const layers = [
    screengridLayer,
    heatmapLayer
  ]

  const toggleOpacity = (_, { checked }) => {
    if (checked === true) {
      setColorScheme(colorRangeNoOpac)
    } else {
      setColorScheme(colorRange)
    }
  }

  return (
    <div>
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        onViewStateChange={({ viewState }) => {
          if (viewState.zoom <= 12) {
            setGridOpacity(0.5)
            setHeatmapOpacity(0.25)
          } else {
            setGridOpacity(0)
            setHeatmapOpacity(1)
          }

          let newPointSize = 50
          if (viewState.zoom > 14.5) {
            newPointSize = 150
          }
          if (viewState.zoom <= 14.5) {
            newPointSize = (100)
          }
          if (viewState.zoom <= 14) {
            newPointSize = (75)
          }
          if (viewState.zoom <= 13) {
            newPointSize = (50)
          }
          if (viewState.zoom <= 11) {
            newPointSize = (25)
          }
          if (pointSize !== newPointSize) setPointSize(newPointSize)
        }}
        controller
      >
        <StaticMap
          reuseMaps
          mapStyle='mapbox://styles/cl3mo/ckpola0cf029417si6ngscmqq'
          mapboxApiAccessToken={mapboxToken}
          preventStyleDiffing
        />
      </DeckGL>
      <MenuExampleInputs />
    </div>
  )
}

export const renderToDOM = container => {
  csv(csvFile, (error, data) => {
    if (error) {
      console.error(error)
      return
    }
    render(<Heatmap data={data} />, container)
  }).on('progress', event => {
    if (event.lengthComputable) {
      const percentComplete = Math.round(event.loaded * 100 / event.total)
      console.log(percentComplete)
    }
  })
}
