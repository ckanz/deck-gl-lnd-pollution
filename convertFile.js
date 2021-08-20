const OsGridRef = require('mt-osgridref')
const parse = require('csv-parse')
const fs = require('fs')

const aggregatedMap = {}
const FLOATING_POINT = 3

const fileName = process.argv[2]

fs.createReadStream(`./${fileName}`)
  .on('error', console.error)
  .pipe(parse({ delimiter: ',', from: 2 }))
  .on('data', row => {
    const parsedRow = row.map(Number)
    const point = new OsGridRef(parsedRow[0], parsedRow[1])
    const { _lat, _lon } = OsGridRef.osGridToLatLong(point)
    const dataValue = parsedRow[2]

    const roundedLat = _lat.toFixed(FLOATING_POINT)
    const roundedLon = _lon.toFixed(FLOATING_POINT)
    const posKey = `${roundedLat}-${roundedLon}`
    if (!aggregatedMap[posKey]) {
      aggregatedMap[posKey] = {
        position: [roundedLat, roundedLon],
        values: []
      }
    }
    aggregatedMap[posKey].values.push(dataValue)
  })
  .on('end', () => {
    const aggDataArray = Object.values(aggregatedMap).map(v => {
      const sum = v.values.reduce((a, b) => a + b, 0)
      const avg = (sum / v.values.length) || 0
      return `${[...v.position, avg].join(',')}\n`
    })
    aggDataArray.unshift('lat,lon,conc\n')

    const outFile = fs.createWriteStream(`${fileName.slice(0, -4)}-converted.csv`)
      .on('error', console.error)
    aggDataArray.forEach(row => outFile.write(row))
  })
