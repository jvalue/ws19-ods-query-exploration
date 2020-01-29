const toJsonSchema = require('to-json-schema')
const jsonPegel = require('./../example-data/01-pegel-stations.json')
const jsonCrime = require('./../example-data/02-crime-data.json')
const jsonSba = require('./../example-data/04-sba-public-us.json')

const server = require('http').createServer()
const io = require('socket.io')(server)

//Options for schema generation
const options = {
  objects: { additionalProperties: true },
}

io.on('connection', client => {
  client.on('create-table', data => {
    console.log('*** create-table event triggered ***')
    console.log('data: ' + data)

    if (data == '01') {
      const now = createDate()
      const name = 'pegeldata_' + now
      const wrappedJson = {}
      wrappedJson[name] = jsonSba

      console.log(wrappedJson)

      const schema = toJsonSchema(jsonSba, options)
      client.emit('create-table', schema, 'pegel')
    }
    if (data == '02') {
      const schema = toJsonSchema(jsonCrime[0], options)
      client.emit('create-table', schema, 'crime')
    }
    /*if(data == '03')
        {
            var schema = toJsonSchema(jsonBundestag[0], options);
            client.emit('create-table', schema, 'bundestag');
        }*/
  })

  client.on('insert-data', (data, index) => {
    console.log('*** insert-data event triggered ***')
    console.log('data: ' + data)
    console.log('index: ' + index)
    if (data == '01') {
      var schema = toJsonSchema(jsonPegel[0], options)
      client.emit('insert-data', jsonPegel[index], index, schema, 'pegel')
    }
    if (data == '02') {
      var schema = toJsonSchema(jsonCrime[0], options)
      client.emit('insert-data', jsonCrime[index], index, schema, 'crime')
    }
    /*if(data == '03')
        {
            var schema = toJsonSchema(jsonBundestag[0], options);
            client.emit('create-table', schema, 'bundestag');
        }*/
  })
  client.on('disconnect', () => {
    /* … */
  })
})

server.listen(3000)

function createDate() {
  let today = new Date()
  let dd = today.getDate()

  let mm = today.getMonth() + 1
  const yyyy = today.getFullYear()
  let HH = today.getHours()
  let MM = today.getMinutes()
  let SS = today.getSeconds()

  if (dd < 10) {
    dd = `0${dd}`
  }

  if (mm < 10) {
    mm = `0${mm}`
  }

  if (HH < 10) {
    HH = `0${HH}`
  }

  if (MM < 10) {
    MM = `0${MM}`
  }

  if (SS < 10) {
    SS = `0${SS}`
  }

  today = `${dd}-${mm}-${yyyy}_${HH}:${MM}:${SS}`
  return today
}

console.log('Server listening on port 3000')

//Debug
//console.log(jsonPegel[0]);

// ** Does not work with Bundestag weird format **
var schema = toJsonSchema(jsonSba, options)

//Result

console.log(schema)
/*
console.log('************')
console.log((schema.properties.water));
*/
