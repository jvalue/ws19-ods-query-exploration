var toJsonSchema = require('to-json-schema');
var jsonPegel = require('./../example-data/01-pegel-stations.json');
var jsonCrime = require('./../example-data/02-crime-data.json');
var jsonBundestag = require('./../example-data/03-protocol-bundestag.json');

const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', client => {   
    client.on('create-table', data => { 
        console.log('*** create-table event triggered ***')
        console.log('data: '+ data)

        if(data == '01')
        {
            var schema = toJsonSchema(jsonPegel[0], options);
            client.emit('create-table', schema, 'pegel');
        }
        if(data == '02')
        {
            var schema = toJsonSchema(jsonCrime[0], options);
            client.emit('create-table', schema, 'crime');
        }
        /*if(data == '03')
        {
            var schema = toJsonSchema(jsonBundestag[0], options);
            client.emit('create-table', schema, 'bundestag');
        }*/
    });
    client.on('insert-data', (data, index) => { 
        console.log('*** insert-data event triggered ***')
        console.log('data: '+ data)
        console.log('index: '+ index)
        if(data == '01')
        {
            var schema = toJsonSchema(jsonPegel[0], options);
            client.emit('insert-data',jsonPegel[index], index, schema, 'pegel');
        }
        if(data == '02')
        {
            var schema = toJsonSchema(jsonCrime[0], options);
            client.emit('insert-data',jsonCrime[index], index, schema, 'crime');
        }
        /*if(data == '03')
        {
            var schema = toJsonSchema(jsonBundestag[0], options);
            client.emit('create-table', schema, 'bundestag');
        }*/
    });
    client.on('disconnect', () => { /* … */ });
});


server.listen(3000);
console.log('Server listening on port 3000');

//Options for schema generation
var options = 
{
    objects: {additionalProperties: true},
}

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
