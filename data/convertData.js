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

const processFile = async (fileName) => {
  console.log(`\nStarting processing: ${fileName}`)
  
  let rowCount = 0
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(`./data/CSV/${fileName}`)
      .on('error', reject)
      .pipe(parse({ delimiter: ',', from: 2 }))
      .on('data', row => {
        rowCount++
        if (rowCount % 1000 === 0) {
          process.stdout.write(`\r${fileName}: Processing row ${rowCount}...`)
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
      })
      .on('end', () => {
        process.stdout.write(`\r${fileName}: Processing complete - Aggregating ${rowCount} rows...`)
        
        const aggDataArray = []
        aggregatedMap.forEach((v, key) => {
          const avg = (v.reduce((a, b) => a + b, 0) / v.length) || 0.0
          aggDataArray.push(`${[key, avg.toFixed(5)].join(',')}\n`)
        })
        aggDataArray.unshift('lat,lon,conc\n')

        const outFile = fs.createWriteStream(`./data/${fileName.slice(0, -4)}-converted.csv`)
          .on('error', reject)
        aggDataArray.forEach(row => outFile.write(row))
        
        process.stdout.write(`\r${fileName}: Complete! Generated ${aggDataArray.length - 1} aggregated points from ${rowCount} rows\n`)
        console.log(`  Output: ${fileName.slice(0, -4)}-converted.csv`)
        
        // Clear the aggregated map for the next file
        aggregatedMap.clear()
        resolve()
      })
  })
}

const main = async () => {
  try {
    console.log('Starting file processing...')
    console.log(`Found ${files.length} files to process: ${files.join(', ')}`)
    console.log('='.repeat(60))
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`\n[${i + 1}/${files.length}] Processing: ${file}`)
      await processFile(file)
    }
    
    console.log('\nAll files processed successfully!')
  } catch (error) {
    console.error('\nError during processing:', error)
  }
}

main()