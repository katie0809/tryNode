const http = require('http')
const data = JSON.stringify({"clientKey": "sooo123456","image": "abcd"})
const options = {
  hostname: '10.226.40.31',
  port: 9071,
  path: '/v1/invest/begin/ocr";',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}
const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`)
  res.on('data', (d) => {
    process.stdout.write(d)
  })
})
req.on('error', (error) => {console.error(error)  })  
req.write(data)
req.end()


