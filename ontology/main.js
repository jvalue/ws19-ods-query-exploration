var fs = require("fs");
const queryTool = require("./query");
const { Pool } = require("pg");
const sbaJson = require("./../example-data/04-sba-public-us.json");
const pegelJson = require("./../example-data/01-pegel-stations.json");

//connection information
const pool = new Pool({
  database: process.argv[3]
});

const fileName = process.argv[2];
var file;

switch (fileName) {
  case "sba":
    file = sbaJson.dataset[0];
  case "pegel":
    file = pegelJson[0];
}

var ontology = extractOntologyFromObject(generateRootNode(fileName), file);

fs.writeFile("data.json", JSON.stringify(ontology), function(err) {
  if (err) throw err;
  console.log("See data.json for output data!");
});

pool.query(ontologyToPGQuery(ontology), (err, res) => {
  console.log(err, res);
  pool.end();
});

//Ontology Functions

/**
 *
 * @param {*} rootName
 */
function generateRootNode(rootName) {
  var rootNode = {
    name: rootName,
    children: [
      {
        name: "attributes",
        children: [{ name: "ID", value: "number" }]
      },
      {
        name: "related",
        children: []
      }
    ]
  };

  return rootNode;
}

/**
 *
 * @param {*} rootNode
 * @param {*} data
 */
function extractOntologyFromObject(rootNode, data) {
  var keys = Object.keys(data);
  var node = rootNode.children;
  var attributes = node[0].children;
  var related = node[1].children;
  for (var i = 0; i < keys.length; i++) {
    var element = keys[i];
    if (Object.prototype.toString.call(data[element]) == "[object Array]") {
      if (typeof data[element][0] == "object") {
        var relate = {
          name: element,
          children: [
            {
              name: "attributes",
              children: [
                { name: "ID", value: "number" },
                {
                  name: rootNode.name + "Id",
                  value: "number"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        };

        related.push(extractOntologyFromObject(relate, data[element][0]));
      } else if (typeof data[element][0] != "undefined") {
        var attr = {
          name: element,
          value: typeof data[element][0] + "[]"
        };
        attributes.push(attr);
      }
    } else if (
      Object.prototype.toString.call(data[element]) == "[object Object]"
    ) {
      var relate = {
        name: element,
        children: [
          {
            name: "attributes",
            children: [
              { name: "ID", value: "number" },
              {
                name: rootNode.name + "Id",
                value: "number"
              }
            ]
          },
          {
            name: "related",
            children: []
          }
        ]
      };

      related.push(extractOntologyFromObject(relate, data[element]));
    } else {
      var attr = {
        name: element,
        value: typeof data[element]
      };
      attributes.push(attr);
    }

    if (element == "0") break;
  }

  return rootNode;
}

//Query Functions

/**
 *
 * @param {*} graph
 */
function ontologyToPGQuery(graph) {
  var query = queryTool.CREATESCHEMA(graph.name);
  query += createQuery(graph, graph.name, 0);
  return query;
}

/**
 *
 * @param {*} graph
 * @param {*} schemaName
 * @param {*} flag
 */
function createQuery(graph, schemaName, flag) {
  var query = queryTool.CREATETABLE(graph.name, schemaName);

  var attributes = graph.children[0].children;
  var related = graph.children[1].children;

  for (var x = 0; x < attributes.length; x++) {
    var name = attributes[x].name;
    var suffix = "";
    if (flag > 0 && x == 1) {
      suffix =
        "REFERENCES " +
        schemaName +
        "_schema." +
        name.slice(0, name.length - 2) +
        "(id)";
    }
    query += queryTool.ADDCOLUMN(name, attributes[x].value, suffix);
  }
  query += queryTool.ADDPRIMEKEY(attributes[0].name, graph.name);
  for (var y = 0; y < related.length; y++) {
    query += createQuery(related[y], schemaName, 1);
  }
  return query;
}
