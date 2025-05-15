const OsGridRef = require('mt-osgridref')
const parse = require('csv-parse')
const fs = require('fs')

const aggregatedMap = new Map()
const GRID_PRECISION = 2
const LATLON_PRECISION = 5
const OFFSET = 0.001

// TODO: add step that downloads files and unzips them

const files = [
  'LAEI2016_2016_NO2.csv',
  'LAEI2016_2016_NOx.csv',
  'LAEI2016_2016_PM10.csv',
  'LAEI2016_2016_PM10d.csv',
  'LAEI2016_2016_PM25.csv',
]

const processFile = fileName => {
  fs.createReadStream(`./data/${fileName}`)
    .on('error', console.error)
    .pipe(parse({ delimiter: ',', from: 2 }))
    .on('data', row => {
      row[0] = row[0].slice(0, -GRID_PRECISION) + '00'
      row[1] = row[1].slice(0, -GRID_PRECISION) + '00'
      const parsedRow = row.map(Number)
      const point = new OsGridRef(...parsedRow)
      const { _lat, _lon } = OsGridRef.osGridToLatLong(point)
  
      const roundedLat = (_lat + OFFSET).toFixed(LATLON_PRECISION)
      const roundedLon = (_lon - OFFSET).toFixed(LATLON_PRECISION)
      const posKey = `${roundedLat},${roundedLon}`
      if (!aggregatedMap.has(posKey)) {
        aggregatedMap.set(posKey, [])
      }
      aggregatedMap.get(posKey).push(parsedRow[2])
    })
    .on('end', () => {
      const aggDataArray = []
      aggregatedMap.forEach((v, key) => {
        const avg = (v.reduce((a, b) => a + b, 0) / v.length) || 0.0
        aggDataArray.push(`${[key, avg.toFixed(5)].join(',')}\n`)
      })
      aggDataArray.unshift('lat,lon,conc\n')
  
      const outFile = fs.createWriteStream(`./data/${fileName.slice(0, -4)}-converted.csv`)
        .on('error', console.error)
      aggDataArray.forEach(row => outFile.write(row))
      console.log(outFile, ' file written')
    })
}

files.forEach(file => {
  processFile(file)
})