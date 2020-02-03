module.exports = {
  CREATESCHEMA: function(schemaName) {
    return "CREATE SCHEMA IF NOT EXISTS " + schemaName + "_schema;";
  },

  CREATETABLE: function(tableName, schemaName) {
    return "CREATE TABLE " + schemaName + "_schema." + tableName + "(";
  },

  ADDCOLUMN: function(columnName, type, flags = "") {
    return columnName + " " + typePG[type] + " " + flags + ",";
  },

  ADDPRIMEKEY: function(columnName, tableName) {
    return (
      "CONSTRAINT " + tableName + "_primekey PRIMARY KEY(" + columnName + "));"
    );
  }
};

const typePG = { number: "INT", string: "text", "string[]": "text[]" };
