# JSON object to MariaDB

Evaluation of the library 'generate-schema' from nijikokun.

## Context

A JSON object (open data by different providers) will be loaded. This Object should be parsed by the library and create a MySQL query. This should then be executed.

# Evaluation - From JSON to MariaDB

## Prerequisites

### Installation

`npm i`

---

### MariaDB

A MariaDB installation is mandatory for this project.

Visit [here](https://mariadb.org/download/) to get infromations for the installation of MariaDB.

Setup MariaDB to match following configuration:

```javascript
{
  host: "localhost",
  user: "root",
  password: "root",
  database: "ods",
}
```

---

# Implementation

## main.js

```javascript
function generateQuery(schema)
```

Parses the given schema to a usable query for the MariaDB database.

- schema: <br/>
  Is created by 'generate-schema' library by calling the method <br/>
  `GenerateSchema.mysql(<database_name>, <jsonfile>)` <br/>
  on the loaded json file.

---

# Usage

`node main.js`

# Issues

- JSON data of Bundestag can not be parsed by now
- Issues with to long table names caused by prefixing related tables
- Arrays of primitive data types are treated wrong (new table instead of new column)
