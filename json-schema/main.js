var toJsonSchema = require('to-json-schema');
var jsonPegel = require('./../example-data/01-pegel-stations.json');

//Options for schema generation
var options = 
{
    objects: {additionalProperties: true},
}

//Debug
//console.log(jsonPegel[0]);

var schema = toJsonSchema(jsonPegel[0], options);

//Result
console.log(schema);
console.log('************')
console.log((schema.properties.water));

