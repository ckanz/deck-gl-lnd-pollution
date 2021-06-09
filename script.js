const OsGridRef = require('mt-osgridref');
const parse = require('csv-parse')
const fs = require('fs') 

const data = []
const aggregatedMap = {}
const FLOATING_POINT = 3

fs.createReadStream('./data/no2.csv')
  .pipe(parse({ delimiter: ',', from: 2 }))
  .on('data', row => {
    const point = new OsGridRef(Number(row[0]), Number(row[1]));
    const latlon = OsGridRef.osGridToLatLong(point);
    const dataValue = Number(row[2])
    data.push([ latlon._lat, latlon._lon, dataValue]);

    const posKey = `${latlon._lat.toFixed(FLOATING_POINT)}-${latlon._lon.toFixed(FLOATING_POINT)}`
    if (!aggregatedMap[posKey]) {
      aggregatedMap[posKey] = { position: [latlon._lat.toFixed(FLOATING_POINT), latlon._lon.toFixed(FLOATING_POINT)], values: [] }
    }
    aggregatedMap[posKey].values.push(dataValue)
  })
  .on('end', () => {
    const aggDataArray = Object.values(aggregatedMap).map(v => {
      const sum = v.values.reduce((a, b) => a + b, 0);
      const avg = (sum / v.values.length) || 0;
      return [ ...v.position, avg]
    })
    const file = fs.createWriteStream('./data/array.csv');
    file.on('error', err => { console.error(err) });
    file.write('lat,lon,conc\n')
    aggDataArray.forEach(row => { file.write(row.join(',') + '\n'); });
    file.end();
  })
