var toJsonSchema = require('to-json-schema');
var jsonPegel = require('./../example-data/01-pegel-stations.json');

var options = {
    objects: {additionalProperties: false},
}

var schema = toJsonSchema(jsonPegel[0], options);
console.log(schema);