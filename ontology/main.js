var fs = require("fs");
var util = require("util");
const { Pool, Client } = require("pg");

const typePG = { number: "INT", string: "text", "string[]": "text[]" };

// pools will not use environment variables
// for connection information
const pool = new Pool({
  database: "testdb"
});

//Pegel
const pegel = {
  uuid: "47174d8f-1b8e-4599-8a59-b580dd55bc87",
  number: "48900237",
  shortname: "EITZE",
  longname: "EITZE",
  km: 9.56,
  agency: "WSA VERDEN",
  longitude: 9.27676943537587,
  latitude: 52.90406541008721,
  water: {
    shortname: "ALLER",
    longname: "ALLER"
  }
};

//SBA
const sba = {
  type: "dcat:Dataset",
  title: "SBA IT Policy Archive",
  description: "A list of all public documents relating to SBA IT policy.",
  modified: "2015-08-31",
  accessLevel: "public",
  identifier: "SBA-OCIO-2015-08-002",
  landingPage:
    "https://www.sba.gov/about-sba/sba-performance/open-government/digital-sba/digital-strategy/it-policy-archive",
  license: "http://www.usa.gov/publicdomain/label/1.0/",
  publisher: {
    type: "org:Organization",
    name: "U.S. Small Business Administration"
  },
  contactPoint: {
    type: "vcard:Contact",
    fn: "Asghar Noor",
    hasEmail: "mailto:asghar.noor@sba.gov"
  },
  distribution: [
    //Array mit verschiedenen Objecten
    {
      type: "dcat:Distribution",
      accessURL:
        "https://www.sba.gov/about-sba/sba-performance/open-government/digital-sba/digital-strategy/it-policy-archive",
      title: "SBA IT Policy Archive"
    },
    {
      type: "dcat:Distribution",
      mediaType: "application/zip",
      title: "SBA IT Policy Archive Policy Zip",
      downloadURL:
        "https://inventory.data.gov/dataset/5e3c4309-c3ce-43f8-91c7-d02e7b8cffb8/resource/ab01e3f4-1d92-4f60-9a7d-6ee9f65ee3f5/download/sbaitpolicyarchive.zip"
    }
  ],
  keyword: ["Agency IT Policy Archive", "SBA IT Policy Archive"], //Problem: Type: Array
  bureauCode: ["028:00"],
  programCode: ["028:000"]
};

var ontology = extractOntologyFromObject(
  {
    name: "sba",
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
  },
  sba
);

fs.writeFile("data.json", JSON.stringify(ontology), function(err) {
  if (err) throw err;
  console.log("Saved!");
});

console.log(JSON.stringify(ontology));

console.log(ontologyToPGQuery(ontology));

pool.query(ontologyToPGQuery(ontology), (err, res) => {
  console.log(err, res);
  pool.end();
});

function extractOntologyFromObject(rootNode, data) {
  var keys = Object.keys(data);
  var node = rootNode.children;
  var attributes = node[0].children;
  var related = node[1].children;
  //console.log(rootNode);
  //console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    var element = keys[i];
    console.log("******" + rootNode.name + ": " + element);
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
      console.log("object found");
      console.log(Object.prototype.toString.call(data[element]));
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
    //console.log(typeof data[element]);
  }

  return rootNode;
}
/* Eigentanatz ohne Grapischer Darstellung
var ontology = extractOntologyFromObject(
  { root: { attributes: {}, related: {} } },
  testJson1
);

fs.writeFile("mynewfile3.txt", util.inspect(ontology), function(err) {
  if (err) throw err;
  console.log("Saved!");
});

console.log(ontology);

function extractOntologyFromObject(rootNode, data) {
  var keys = Object.keys(data);
  var rootKey = Object.keys(rootNode);
  var node = rootNode[rootKey];
  console.log(node);

  keys.forEach(element => {
    if (typeof data[element] == "object") {
      /*var relate = {
        type: typeof data[element],
        attributes: {},
        related: []
      };
      relate.attributes[element+"Id"] = 

      node.related[element] = extractOntologyFromObject(relate, data[element]);*/
/*
    } else {
      node.attributes[element] = typeof data[element];
    }
    //console.log(typeof data[element]);
  });

  return rootNode;
}
*/
/*
   } else if (typeof data[element] == "array") {
     /*var relate = {
       name: element,
       type: typeof data[element],
       attributes: [
         {
           name: element + "Id",
           type: "number"
         }
       ],
       related: []
     };

     node.related.push(extractOntologyFromObject(relate, data[element]));*/
/*
/* Solution with Arrays
var ontology = extractOntologyFromObject(
  { name: "root", attributes: [], related: [] },
  testJson
);

fs.writeFile("mynewfile3.txt", util.inspect(ontology), function(err) {
  if (err) throw err;
  console.log("Saved!");
});

console.log(ontology);

function extractOntologyFromObject(node, data) {
  var keys = Object.keys(data);

  console.log(node);

  keys.forEach(element => {
    if (typeof data[element] == "object") {
      var relate = {
        name: element,
        type: typeof data[element],
        attributes: [
          {
            name: element + "Id",
            type: "number"
          }
        ],
        related: []
      };

      node.related.push(extractOntologyFromObject(relate, data[element]));
    } else if (typeof data[element] == "array") {
      var relate = {
        name: element,
        type: typeof data[element],
        attributes: [
          {
            name: element + "Id",
            type: "number"
          }
        ],
        related: []
      };

      node.related.push(extractOntologyFromObject(relate, data[element]));
    } else {
      var attr = {
        name: element,
        type: typeof data[element]
      };

      node.attributes.push(attr);
    }
    //console.log(typeof data[element]);
  });

  return node;
}
*/
var testjson = {
  name: "root",
  children: [
    {
      name: "attributes",
      children: [
        {
          name: "uuid",
          value: "string"
        },
        {
          name: "number",
          value: "string"
        },
        {
          name: "shortname",
          value: "string"
        },
        {
          name: "longname",
          value: "string"
        },
        {
          name: "km",
          value: "number"
        },
        {
          name: "agency",
          value: "string"
        },
        {
          name: "longitude",
          value: "number"
        },
        {
          name: "latitude",
          value: "number"
        }
      ]
    },
    {
      name: "related",
      children: [
        {
          name: "water",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "shortname",
                  value: "string"
                },
                {
                  name: "longname",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        }
      ]
    }
  ]
};

//keyword still wrong
var testJson2 = {
  name: "root",
  children: [
    {
      name: "attributes",
      children: [
        {
          name: "type",
          value: "string"
        },
        {
          name: "title",
          value: "string"
        },
        {
          name: "description",
          value: "string"
        },
        {
          name: "modified",
          value: "string"
        },
        {
          name: "accessLevel",
          value: "string"
        },
        {
          name: "identifier",
          value: "string"
        },
        {
          name: "landingPage",
          value: "string"
        },
        {
          name: "license",
          value: "string"
        }
      ]
    },
    {
      name: "related",
      children: [
        {
          name: "publisher",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "type",
                  value: "string"
                },
                {
                  name: "name",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        },
        {
          name: "contactPoint",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "type",
                  value: "string"
                },
                {
                  name: "fn",
                  value: "string"
                },
                {
                  name: "hasEmail",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        },
        {
          name: "distribution",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "type",
                  value: "string"
                },
                {
                  name: "accessURL",
                  value: "string"
                },
                {
                  name: "title",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        },
        {
          name: "keyword",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "0",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        },
        {
          name: "bureauCode",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "0",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        },
        {
          name: "programCode",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "0",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        }
      ]
    }
  ]
};

//Arrays are differed and solved but objects now dont work
var testJson3 = {
  name: "root",
  children: [
    {
      name: "attributes",
      children: [
        {
          name: "type",
          value: "string"
        },
        {
          name: "title",
          value: "string"
        },
        {
          name: "description",
          value: "string"
        },
        {
          name: "modified",
          value: "string"
        },
        {
          name: "accessLevel",
          value: "string"
        },
        {
          name: "identifier",
          value: "string"
        },
        {
          name: "landingPage",
          value: "string"
        },
        {
          name: "license",
          value: "string"
        },
        {
          name: "keyword",
          value: "string[]"
        },
        {
          name: "bureauCode",
          value: "string[]"
        },
        {
          name: "programCode",
          value: "string[]"
        }
      ]
    },
    {
      name: "related",
      children: [
        {
          name: "distribution",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "type",
                  value: "string"
                },
                {
                  name: "accessURL",
                  value: "string"
                },
                {
                  name: "title",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        }
      ]
    }
  ]
};

//final form
const jsonTest4 = {
  name: "root",
  children: [
    {
      name: "attributes",
      children: [
        {
          name: "uuid",
          value: "string"
        },
        {
          name: "number",
          value: "string"
        },
        {
          name: "shortname",
          value: "string"
        },
        {
          name: "longname",
          value: "string"
        },
        {
          name: "km",
          value: "number"
        },
        {
          name: "agency",
          value: "string"
        },
        {
          name: "longitude",
          value: "number"
        },
        {
          name: "latitude",
          value: "number"
        }
      ]
    },
    {
      name: "related",
      children: [
        {
          name: "water",
          children: [
            {
              name: "attributes",
              children: [
                {
                  name: "rootId",
                  value: "number"
                },
                {
                  name: "shortname",
                  value: "string"
                },
                {
                  name: "longname",
                  value: "string"
                }
              ]
            },
            {
              name: "related",
              children: []
            }
          ]
        }
      ]
    }
  ]
};

//undefined types
var testJson4 = {
  name: "sba",
  children: [
    {
      name: "attributes",
      children: [
        { name: "type", value: "string" },
        { name: "title", value: "string" },
        { name: "description", value: "string" },
        { name: "modified", value: "string" },
        { name: "accessLevel", value: "string" },
        { name: "identifier", value: "string" },
        { name: "landingPage", value: "string" },
        { name: "license", value: "string" },
        { name: "keyword", value: "string[]" },
        { name: "bureauCode", value: "string[]" },
        { name: "programCode", value: "string[]" }
      ]
    },
    {
      name: "related",
      children: [
        {
          name: "publisher",
          children: [
            {
              name: "attributes",
              children: [
                { name: "sbaId", value: "number" },
                { name: "type", value: "string" },
                { name: "name", value: "string" }
              ]
            },
            { name: "related", children: [] }
          ]
        },
        {
          name: "contactPoint",
          children: [
            {
              name: "attributes",
              children: [
                { name: "sbaId", value: "number" },
                { name: "type", value: "string" },
                { name: "fn", value: "string" },
                { name: "hasEmail", value: "string" }
              ]
            },
            { name: "related", children: [] }
          ]
        },
        {
          name: "distribution",
          children: [
            {
              name: "attributes",
              children: [
                { name: "sbaId", value: "number" },
                { name: "type", value: "string" },
                { name: "accessURL", value: "string" },
                { name: "title", value: "string" }
              ]
            },
            { name: "related", children: [] }
          ]
        }
      ]
    }
  ]
};

function ontologyToPGQuery(graph) {
  var query = CREATESCHEMA(graph.name);
  query += createQuery(graph, graph.name, 0);
  return query;
}

function createQuery(graph, schemaName, flag) {
  var query = CREATETABLE(graph.name, schemaName);

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
    query += ADDCOLUMN(name, attributes[x].value, suffix);
  }
  query += ADDPRIMEKEY(attributes[0].name, graph.name);
  for (var y = 0; y < related.length; y++) {
    query += createQuery(related[y], schemaName, 1);
  }
  return query;
}

function CREATESCHEMA(schemaName) {
  return "CREATE SCHEMA IF NOT EXISTS " + schemaName + "_schema;";
}

function CREATETABLE(tableName, schemaName) {
  return "CREATE TABLE " + schemaName + "_schema." + tableName + "(";
}

function ADDCOLUMN(columnName, type, flags = "") {
  return columnName + " " + typePG[type] + " " + flags + ",";
}

function ADDCOLUMN(columnName, type, flags = "") {
  return columnName + " " + typePG[type] + " " + flags + ",";
}

function ADDPRIMEKEY(columnName, tableName) {
  return (
    "CONSTRAINT " + tableName + "_primekey PRIMARY KEY(" + columnName + "));"
  );
}
