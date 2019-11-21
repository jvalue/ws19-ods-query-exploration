# Use of JSON schema for database creation
Evaluations of creation of dynamic databases using dynamic JSON schema

## Context
A dynamically generated JSON schema should now used as the schema for the new database.

# Evaluation - GraphQL

### Setup

#### Installation

`npm install graphql-yoga`

___

## Issues

### 1. Dynamic schema
The requirement is to have dynamic schema because of the variation of data sources.
GraphQL looks like it is not intended to have support for this use-case.
<br/>
<br/>


# Evaluation - Plain NodeJS

### Setup

The used SQL database is MariaDB.
Follow instructions here to install it on windows: 
https://mariadb.com/kb/en/library/installing-mariadb-msi-packages-on-windows/

#### Installation

`npm install mariadb`  
`npm install express --save`


