# London Pollution Heatmap

A interactive web application that visualizes air pollution in London using deck.gl and the London Atmospheric Emissions Inventory (LAEI) 2016 dataset.

## Data Source

The pollution data comes from the [London Atmospheric Emissions Inventory (LAEI) 2016](https://data.london.gov.uk/dataset/london-atmospheric-emissions-inventory--laei--2016/), provided by the Greater London Authority. This comprehensive dataset contains concentration measurements across London using the Ordnance Survey National Grid reference system.

### Data Processing

The raw data undergoes several transformation steps:

1. **Grid Coordinate Conversion**: Original data uses OS Grid References which are converted to latitude/longitude coordinates using the [`mt-osgridref`](https://www.npmjs.com/package/mt-osgridref) library
2. **Spatial Aggregation**: Grid coordinates are rounded to reduce precision and aggregate nearby measurements
3. **Data Averaging**: Multiple concentration values at the same location are averaged to create cleaner visualizations
4. **Format Conversion**: Data is converted from the original Excel format to CSV for efficient processing

## Setup and Installation

- A Mapbox access token

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
- Extract the pollution concentration data
- Convert OS Grid references to lat/lon coordinates using `mt-osgridref`
- Aggregate and clean the data
- Generate processed CSV files for each pollutant type

4. **Start the Development Server**
```bash
npm start
```

The application will open at `http://localhost:3030`