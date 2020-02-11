# ODS Query Explorations
Experiments regarding the storage and query side of the JValue ODS

## Context
The JValue ODS supplies ETL functionality specialized for Open Data. The following experiments evaluate different approaches on how to store loaded and transformed data and make it queriable via a unified interface (preferrable REST or GraphQL)

# Experiment Overview

| # 	|           directory name          	|   status  	|
|:-:	|:---------------------------------:	|:---------:	|
| 1 	|             json-shema            	| potential 	|
| 2 	|  schema-to-database/python-server 	|  failure  	|
| 3 	| schema-to-database/graphql-server 	| suspended 	|
| 4 	| schema-to-database/restapi-server 	| suspended 	|
| 5 	|    schema-to-database/kokun-lib   	| potential 	|
| 6 	|              ontology             	|  success  	|