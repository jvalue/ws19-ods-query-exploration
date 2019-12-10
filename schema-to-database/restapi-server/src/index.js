var mariadb = require('mariadb');
var express = require("express");

//Setup and start of express server
var app = express();app.listen(3000, () => {
 console.log("Server running on port 3000");
});

//Database connection pool
var pool = mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: 'root',
    database: 'ods',
    connectionLimit: 5
});

//Test schema
var jsonSchema = {
    uuid: { type: 'int'},
    name: { type: 'string'}
};

//DEBUG
console.log(jsonSchema.uuid.type);

//routes
app.post("/test", (req, res, next) => {
    pool.getConnection()
    .then(conn => {
        conn.query(generateCreationQuery(jsonSchema));      
    }).catch(err => {
        //not connected
    });
    res.json(generateCreationQuery(jsonSchema));
});

//#region Helper functions

/**
 * Generates table creation query fo a given schema
 * @param {object} schema JSON schema which represents the format of the data soruce
 * @returns create table query for given schema
 */
function generateCreationQuery(schema) 
{
    var sql = 'CREATE TABLE testtable (';
    for (var key in schema)
    {
        if(schema[key].type == 'int')
            sql +=key+' int, ';
        if(schema[key].type == 'string')
            sql +=key+' VARCHAR(255), ';
    }
    sql = sql.substring(0, sql.length - 2);
    sql+= ')';

    return sql;
}

//#endregion