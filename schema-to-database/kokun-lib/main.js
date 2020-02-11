const GenerateSchema = require("generate-schema");

const jsonPegel = require("./../../example-data/01-pegel-stations.json");
const jsonSba = require("./../../example-data/04-sba-public-us.json");
const jsonCrime = require("./../../example-data/02-crime-data.json");

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ods",
  connectionLimit: 5
});

const schema = GenerateSchema.mysql("SBA", jsonSba.dataset[0]);

function generateQuery(schema) {
  const queryArray = schema.split("\n");
  //console.log(queryArray);

  var queryString = [];
  queryString[0] = "";
  var queryIndex = 0;
  queryArray.forEach(element => {
    queryString[queryIndex] = queryString[queryIndex] + element;
    //console.log(queryString);
    if (element.includes(";")) {
      queryIndex++;
      queryString[queryIndex] = "";
    }
  });

  return new Promise(function (resolve) {
    resolve(queryString);
  });
}

generateQuery(schema).then(queryString => {
  queryString.forEach(element => {
    if (element.length != 0) {
      pool
        .getConnection()
        .then(con => {
          con
            .query(element)
            .then(res => {
              console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
              con.end();
            })
            .catch(err => {
              //handle error
              console.log(err);
              con.end();
            });
        })
        .catch(err => {
          //not connected
        });
    }
  });
});