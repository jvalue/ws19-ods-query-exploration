var toJsonSchema = require('to-json-schema')
var jsonPegel = require('./../example-data/01-pegel-stations.json')
var jsonCrime = require('./../example-data/02-crime-data.json')
var jsonBundestag = require('./../example-data/03-protocol-bundestag.json')
var jsonBundestag_v1 = require('./../example-data/03.1-protocol-bundestag.json')
var jsonBundestag_v2 = require('./../example-data/03.2-protocol-bundestag.json')
var jsonBundestag_v3 = require('./../example-data/03.3-protocol-bundestag.json')
var jsonBundestag_v3_1 = require('./../example-data/03.3.1-protocol-bundestag.json')
var jsonBundestag_v3_2 = require('./../example-data/03.3.2-protocol-bundestag.json')
var jsonBundestag_v3_2_1 = require('./../example-data/03.3.2.1-protocol-bundestag.json')
var jsonBundestag_v4 = require('./../example-data/03.4-protocol-bundestag.json')

const server = require('http').createServer()
const io = require('socket.io')(server)

io.on('connection', client => {
  client.on('create-table', data => {
    console.log('*** create-table event triggered ***')
    console.log('data: ' + data)

    if (data == '01') {
      var schema = toJsonSchema(jsonPegel[0], options)
      client.emit('create-table', schema, 'pegel')
    }
    if (data == '02') {
      var schema = toJsonSchema(jsonCrime[0], options)
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

//server.listen(3000);
console.log('Server listening on port 3000')

//Options for schema generation
var options = {
  objects: { additionalProperties: true },
}

testJSONArray = {
  bigfoobar: {
    name: 'John',
    age: 30,
    foobarfoo: {
      barfoo: {
        foobar: [
          {
            foo: [
              {
                bar: [
                  {
                    Hans: 'Peter',
                  },
                  {
                    Hans: 'Peter',
                  },
                ],
                cars: [
                  '[Fürd]',
                  '/BMW',
                  '(Fiat)',
                  '(Anhaltender Beifall bei der CDU/CSU – Beifall bei der SPD und dem BÜNDNIS 90/DIE GRÜNEN sowie bei Abgeordneten der FDP)',
                ],
              },
            ],
          },
        ],
      },
    },
  },
}

var schema = toJsonSchema(testJSONArray, options)

console.log(schema)

//Debug
//console.log(jsonPegel[0]);

// ** Does not work with Bundestag weird format **
//var schema = toJsonSchema(jsonBundestag[0], options);

//Result
/*
console.log(schema);
console.log('************')
console.log((schema.properties.water));
*/
