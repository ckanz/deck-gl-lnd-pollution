const OsGridRef = require('mt-osgridref')
const parse = require('csv-parse')
const fs = require('fs')

const aggregatedMap = new Map()
const GRID_PREC = 2
const LATLON_PREC = 5
const OFFSET = 0.001

const fileName = process.argv[2]

fs.createReadStream(`./${fileName}`)
  .on('error', console.error)
  .pipe(parse({ delimiter: ',', from: 2 }))
  .on('data', row => {
    row[0] = row[0].slice(0, -GRID_PREC) + '00'
    row[1] = row[1].slice(0, -GRID_PREC) + '00'
    const parsedRow = row.map(Number)
    const point = new OsGridRef(...parsedRow)
    const { _lat, _lon } = OsGridRef.osGridToLatLong(point)

    const roundedLat = (_lat + OFFSET).toFixed(LATLON_PREC)
    const roundedLon = (_lon - OFFSET).toFixed(LATLON_PREC)
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

    // const outFile = fs.createWriteStream(`${fileName.slice(0, -4)}-converted.csv`)
    const outFile = fs.createWriteStream('array-2.csv')
      .on('error', console.error)
    aggDataArray.forEach(row => outFile.write(row))
    console.log('file written')
  })
