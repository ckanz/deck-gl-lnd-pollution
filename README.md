# London Pollution Heatmap

A interactive web application that visualizes air pollution in London using deck.gl and the London Atmospheric Emissions Inventory (LAEI) 2016 dataset.

## Data Source

The pollution data comes from the [London Atmospheric Emissions Inventory (LAEI) 2016](https://data.london.gov.uk/dataset/london-atmospheric-emissions-inventory--laei--2016/), provided by the Greater London Authority. This comprehensive dataset contains concentration measurements across London using the Ordnance Survey National Grid reference system.
The raw data is processed by converting OS Grid References to latitude/longitude, aggregating nearby points, averaging concentration values, and converting the final data to CSV format. The OS Grid conversion is handled using the [`mt-osgridref`](https://github.com/peterhaldbaek/mt-osgridref) library by @peterhaldbaek. The original code was written by Chris Veness and can be found at http://www.movable-type.co.uk/scripts/latlong-gridref.html.

The application is hosted on [https://ckanz.github.io/London-Pollution-with-DeckGL/dist](https://ckanz.github.io/London-Pollution-with-DeckGL/dist/) .

## Setup and Installation

### Prerequisites

- A [Mapbox access token](https://www.mapbox.com/help/define-access-token/)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure Mapbox Token**
Create a `src/creds.js` file with your [Mapbox access token](https://www.mapbox.com/help/define-access-token/):
```javascript
export const mapboxToken = '{YOUR_MAPBOX_TOKEN}'
```

3. **Download and Process Data**
The project includes scripts to automatically fetch and process the LAEI data:
```bash
npm run fetchData
npm run convertData
```

This will:
- Download the LAEI 2016 dataset (133MB zip file)
- Extract the files from the archive
- Convert OS Grid references to lat/lon coordinates using `mt-osgridref`
- Aggregate the data
- Generate processed CSV files for each pollutant type

4. **Start the Development Server**
```bash
npm start
```

The application will open at `http://localhost:3030`

### Screenshots

![screenshot3](https://github.com/ckanz/deck-gl-lnd-pollution/blob/main/Screenshot_HeatMap.png?raw=true)
![screenshot1](https://github.com/ckanz/deck-gl-lnd-pollution/blob/main/Screenshot_GridCell.png?raw=true)
![screenshot2](https://github.com/ckanz/deck-gl-lnd-pollution/blob/main/Screenshot_ScreenGrid.png?raw=true)


