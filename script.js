const OsGridRef = require('mt-osgridref');
const parse = require('csv-parse')
const fs = require('fs') 

const data = []
fs.createReadStream('./data/no2.csv')
  .pipe(parse({ delimiter: ',', from: 2 }))
  .on('data', row => {
    const point = new OsGridRef(Number(row[0]), Number(row[1]));
    const latlon = OsGridRef.osGridToLatLong(point);
    data.push([ latlon._lat, latlon._lon, Number(row[2])]);
  })
  .on('end', () => {
    const file = fs.createWriteStream('./data/array.csv');
    file.on('error', err => { console.error(err) });
    file.write('lat,lon,conc\n')
    data.forEach(row => { file.write(row.join(',') + '\n'); });
    file.end();
  })
