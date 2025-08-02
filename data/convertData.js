const OsGridRef = require('mt-osgridref')
const parse = require('csv-parse')
const fs = require('fs')

const aggregatedMap = new Map()
const GRID_PRECISION = 2
const OFFSET = 0.001

const files = [
  'LAEI2016_2016_NO2.csv',
  'LAEI2016_2016_NOx.csv',
  'LAEI2016_2016_PM10.csv',
  'LAEI2016_2016_PM10d.csv',
  'LAEI2016_2016_PM25.csv',
]

const EXPECTED_ROWS = 3e7
let rowCount = 0

const processFile = fileName => {
  fs.createReadStream(`./data/CSV/${fileName}`)
    .on('error', console.error)
    .pipe(parse({ delimiter: ',', from: 2 }))
    .on('data', row => {
      if (rowCount % 10000 === 0) {
        process.stdout.write(`\rProcessed ${rowCount} (${((rowCount / EXPECTED_ROWS) * 100).toFixed(2)}%) rows...`)
      }
      row[0] = row[0].slice(0, -GRID_PRECISION) + '00'
      row[1] = row[1].slice(0, -GRID_PRECISION) + '00'
      const parsedRow = row.map(Number)
      const point = new OsGridRef(...parsedRow)
      const { _lat, _lon } = OsGridRef.osGridToLatLong(point)
  
      const posKey = `${_lat + OFFSET},${_lon - OFFSET}`
      if (!aggregatedMap.has(posKey)) {
        aggregatedMap.set(posKey, [])
      }
      aggregatedMap.get(posKey).push(parsedRow[2])
      rowCount++
    })
    .on('end', () => {
      const aggDataArray = []
      aggregatedMap.forEach((v, key) => {
        const avg = (v.reduce((a, b) => a + b, 0) / v.length) || 0.0
        aggDataArray.push(`${[key, avg.toFixed(5)].join(',')}\n`)
      })
      aggDataArray.unshift('lat,lon,conc\n')
  
      const outFileName = `./data/${fileName.slice(0, -4)}-converted.csv`
      const outFile = fs.createWriteStream(outFileName)
        .on('error', console.error)
      aggDataArray.forEach(row => outFile.write(row))
      console.log(outFileName, ' file written')
    })
}

files.forEach(file => {
  processFile(file)
})