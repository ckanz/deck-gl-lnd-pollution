import React, { useState } from 'react'
import DeckGL from '@deck.gl/react'
import { render } from 'react-dom'
import { StaticMap } from 'react-map-gl'
import { HeatmapLayer, ScreenGridLayer } from '@deck.gl/aggregation-layers'
import { csv } from 'd3-request'
import { scaleLinear } from 'd3-scale'
import { mapboxToken } from './creds.js'

// TODO: load all pollutants
import csvFile from './array-2.csv'

// import 'semantic-ui-css/semantic.min.css' // TODO: which css-loader version to use of webpack4?
import { Menu, Checkbox, Dropdown } from 'semantic-ui-react'

const INITIAL_VIEW_STATE = {
  longitude: -0.1,
  latitude: 51.5,
  zoom: 13,
  minZoom: 9,
  maxZoom: 13,
  pitch: 0,
  bearing: 0
}

const defaultColorRange = [
  [5, 255, 8, 50],
  [5, 217, 8, 100],
  [154, 178, 76, 150],
  [253, 141, 60, 175],
  [240, 59, 32, 182],
  [189, 0, 38, 200]
]

const colorRangeForFullOpacity = [
  [5, 255, 8, 0],
  [5, 217, 8, 0],
  [154, 178, 76, 0],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38]
]

const gridOpacityScale = scaleLinear().domain([10, 12]).range([1, 0]).clamp(true);
const heatmapOpacityScale = scaleLinear().domain([10, 12]).range([0, 1]).clamp(true);

const getPosition = d => [Number(d.lon) - 0.002, Number(d.lat) + 0.001]
const getWeight = d => Number(d.conc)

// TODO: add dropdown menu for aggregation methods
// TODO: add dropdown menu for different pollutants
const MenuExampleInputs = ({toggleOpacity, colorScheme}) => (
  <Menu style={{ position: 'absolute', width: '100%', margin: 0 }}>
    <Menu.Item>
      <Checkbox toggle label='show low emissions as transparent' onClick={toggleOpacity} checked={colorScheme == colorRangeForFullOpacity} />
    </Menu.Item>
    {/* <Menu.Item>
      <Menu.Header>Aggregation Method</Menu.Header>
      <Dropdown value="MEAN" onChange={(a,b,c) => { console.log(a,b,c)}}>
        <Dropdown.Menu value={'MEAN'} onChange={(a,b,c) => { console.log(a,b,c)}}>
          <Dropdown.Item value="MIN" key="MIN">
            MIN
          </Dropdown.Item>
          <Dropdown.Item value="MEAN" key="MEAN">
            MEAN
          </Dropdown.Item>
          <Dropdown.Item value="MAX" key="MAX">
            SUM
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item> */}
  </Menu>
)

const Heatmap = ({ data }) => {
  const [gridOpacity, setGridOpacity] = useState(gridOpacityScale(INITIAL_VIEW_STATE.zoom))
  const [heatmapOpacity, setHeatmapOpacity] = useState(heatmapOpacityScale(INITIAL_VIEW_STATE.zoom))
  const [colorRange, setColorRange] = useState(defaultColorRange)

  const screenGridLayer = new ScreenGridLayer({
    id: 'screen-grid-layer',
    data,
    pickable: false,
    cellSizePixels: 10,
    cellMarginPixels: 30,
    opacity: gridOpacity,
    colorRange,
    getPosition,
    getWeight,
    aggregation: 'MEAN'
  })

  const heatmapLayer = new HeatmapLayer({
    id: 'heatmap',
    data: data,
    opacity: heatmapOpacity,
    getPosition,
    radiusPixels: 50,
    colorRange,
    getWeight,
    aggregation: 'MEAN'
  })

  const layers = [
    screenGridLayer,
    heatmapLayer
  ]

  const toggleOpacity = (_, { checked }) => {
    if (checked === true) {
      setColorRange(colorRangeForFullOpacity)
    } else {
      setColorRange(defaultColorRange)
    }
  }

  return (
    <div>
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
          mapStyle='mapbox://styles/cl3mo/ckpola0cf029417si6ngscmqq'
          mapboxApiAccessToken={mapboxToken}
          preventStyleDiffing
        />
      </DeckGL>
      <MenuExampleInputs
        toggleOpacity={toggleOpacity}
        colorScheme={colorRange}
      />
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
