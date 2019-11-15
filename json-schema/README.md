# JSON object to schema
Evaluations of libraries to create schema out of different JSON sources

## Context
The provided json data have no standard schema, which prevents the easy accessiblity of those data via queries. To establish a base for a standardized interface by creating schemas in the first place for later use in databases.

# Evaluation
The following section will show the evaluated libraries, the progress, problems and facit.

## to-json-schema
---

### Setup

#### Installation

`npm install to-json-schema`

#### Integration

```javascript
const toJsonSchema = require('to-json-schema');

const objToBeConverted = {
  name: 'David',
  rank: 7,
  born: '1990-04-05T15:09:56.704Z',
  luckyNumbers: [7, 77, 5]
};

const schema = toJsonSchema(objToBeConverted);
```

For more details look up the documentation at 
https://github.com/ruzicka/to-json-schema

___
### Issues

#### 1. Nested json objects

Nested json objects are ignored by this lib, which causes an incomplete schema generation


