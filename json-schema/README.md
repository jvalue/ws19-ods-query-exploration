# JSON object to schema

Evaluations of libraries to create schema out of different JSON sources

## Context

The provided json data have no standard schema, which prevents the easy accessiblity of those data via queries. To establish a base for a standardized interface by creating schemas in the first place for later use in databases.

The `main.js` file is deprecated.

# Evaluation

The following section will evaluate the library to-json-schema.

---

## Setup

### Installation

`npm install to-json-schema`

### Integration

```javascript
const toJsonSchema = require('to-json-schema')

const objToBeConverted = {
  name: 'David',
  rank: 7,
  born: '1990-04-05T15:09:56.704Z',
  luckyNumbers: [7, 77, 5],
}

const schema = toJsonSchema(objToBeConverted)
```

For more details look up the documentation at
https://github.com/ruzicka/to-json-schema

## Socket

This implementation also communicates with the `schema-to-database/python-server` via the library `socket.io`

## Usage

`node socket-server-v1.js`

### Event 'create-table'

This event creates and emits a json schema depending on the incoming data.

- `data == '01`'

  - creates and emits json schema for `pegel` data

- `data == '02`'
  - creates and emits json schema for `crime` data

### Event 'insert-data'

This event emits a dataset depending on the incoming data.

- `data == '01'`

  - emits `pegel` data

- `data == '02'`
  - emits `crime` data

---

## Issues

### 1. Nested json objects (solved)

Nested json objects are ignored by this lib, which causes an incomplete schema generation

Solution: The library works as intended. When checking the schema step by step it is in the right format. Issue was with trying to print it on the console.

### 2. Bundestag JSON data is not parsable

When trying to parse the above named file the following error appears:  
`Type of value couldn't be determined`

The file will be split into different segments too check why this error occurs.

#### 2.1 File: 03.1-protocol-bundestag.json (working!)

#### 2.2 File: 03.2-protocol-bundestag.json (not working!)

#### 2.3 File: 03.3-protocol-bundestag.json (not working!)

#### 2.3.1 File: 03.3.1-protocol-bundestag.json (working!)

#### 2.3.2 File: 03.3.2-protocol-bundestag.json (not working, problem found!)

#### 2.3.2.1 File: 03.3.2.1-protocol-bundestag.json (working!)

#### 2.4 File: 03.4-protocol-bundestag.json (working!)

---

Conclusion:

The library has issues with parsing simple arrays inside the bundestag JSON:

```json
"kommentar": [
                "(Beifall)",
                "(Beifall bei der CDU/CSU, der SPD, ...)",
                "(Beifall bei der CDU/CSU, der SPD, ...)",
                "(Beifall der Abg. Gitta Connemann [CDU/CSU])",
                "(Beifall bei der CDU/CSU, ...)",
                "..."
              ]
```

---

Next step - reproducing this error:

#### 1. Simple JSON Object including an array (working!)

```javascript
testJSONArray = {
  name: 'John',
  age: 30,
  cars: ['Ford', 'BMW', 'Fiat'],
}
```

#### 2. Simple JSON Object including an array including "[ ]"(working!)

```javascript
testJSONArray = {
  name: 'John',
  age: 30,
  cars: ['[Ford]', 'BMW', 'Fiat'],
}
```

#### 3. Simple JSON Object including an array including "( )"(working!)

```javascript
testJSONArray = {
  name: 'John',
  age: 30,
  cars: ['(Ford)', 'BMW', 'Fiat'],
}
```

#### 4. Simple JSON Object including an array including "/"(working!)

```javascript
testJSONArray = {
  name: 'John',
  age: 30,
  cars: ['/Ford', 'BMW', 'Fiat'],
}
```

#### 5. Simple JSON Object including a key as array and string(working!)

```javascript
testJSONArray = {
  name: 'John',
  age: 30,
  cars: ['/Ford', 'BMW', 'Fiat'],
  cars: 'Mercedes',
}
```

#### 5. JSON Object including a similar structure like Bundestag(working!)

```javascript
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
```
