# JSON schema to PostgreSQL

Evaluation of a library to create tables and insert data depending on given json objects

## Context

A JSON object (open data by different providers) will be received by the `json-schema/socket-server-v1.js` service. The library will then create a PostgreSQL schema from the json object or insert data into an existing table.

# Evaluation - From JSON to PostgreSQL

## Prerequisites

### Installation

Run `pip install -r requirements.txt` (Python 2), or `pip3 install -r requirements.txt` (Python 3)

---

### PostgreSQL

A PostgreSQL installation is mandatory for this project.

Visit [here](https://www.postgresql.org/docs/12/installation.html) to get infromations for the installation of PostgreSQL.

The project uses the user: `root` and the database: `testdb`. Therefore a database and a user needs to be created to ensure the usability of the project.

---

# Implementation

## main.py

```python
sio.connect('http://localhost:3000')
```

Via the socket.io library a connection to the above mentions service is established.

```python
@sio.on('create-table')
def on_message(schema_data, schema_name)
```

After this event is called a table will be created by passing `schema_data` and `schema_name` to the function `create_table(schema_data, schema_name)`

---

```python
@sio.on('insert-data')
def on_message(json_data, index, schema_data, schema_name):
```

After this event is called data will be inserted by passing all parameters to the function `insert_data(json_data, index, schema_data, schema_name)`

---

```python
def create_table(schema_data, schema_name):
```

Creates a schema and a table based on the given parameters.

```python
translator = jsonschema2db.JSONSchemaToPostgres(
        schema_data,
        postgres_schema='schm',
        item_col_name='loan_file_id',
        item_col_type='string',
        abbreviations={
            'AbbreviateThisReallyLongColumn': 'AbbTRLC',
        }
    )
```

The library creates the PostgreSQL schema (called `translator` ) via this code snippet. `schema_data` here is the JSON schema.

---

```python
def insert_data(json_data, index, schema_data, schema_name)
```

As the `create_table` function a translator will be created.
The main differencte is `translator.insert_items(con, [(schema_name + index, json_data)])`

This line inserts the `json_data` into the table inside the schema `schema_name` with the id `schema_name + index`

---

```python
def delete_schema(schema_name):
```

Deletes the desired schema `schema_name`.

# Usage

## Custom CLI

`pyhton3 main.py`

This opens a custom cli with the text:

`Enter the one of the following commands:` <br>
`create | insert | delete` <br>
`-->` <br>

After inserting one of this commands the next input follows:

`Enter the one of the following sources:` <br>
`"01" for pegel | "02" for crime` <br>
`-->` <br>

If `insert` was entered in the first place follwing promt will appere:

`Enter the desired index:` <br>
`e.g. "1" without "` <br>
`-->` <br>

By entering the last command the arguments will be processed and excecuted.
