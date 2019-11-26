/**
 * @file
 * js-export-table-schema.js
 *
 * Exports the current database configuration to the file defined in config.database.export_path
 *
 * @usage
 * node index.js
 */

const mysql = require('mysql');
const dbdiff = require('dbdiff');
const fs = require('fs');

// MAIN OPTIONS.

// The location that the exported json ends up.
const export_path = 'table-schema.json';
// The database connection info. Hopefully, you have this.
const database = {
  "host": "127.0.0.1",
  "database": "test_db",
  "user": "local_user",
  "password": "text_password",
};

// Create the basic connection to the database.
const db = mysql.createConnection(database);

// ...and error out if we don't get it.
db.connect(error => {
  if (error) {
    throw error;
  }
  console.log("Database connected!");
});

// The MySQL connection string consumed by dbdiff.
const db_description = `mysql://${database.user}:${database.password}@${database.host}/${database.database}`;

// dbdiff has a really need "describe database" function that, at its core, outputs
// really long strings describing the database as a JSON object that can later
// be imported.
dbdiff.describeDatabase(db_description)
  .then((schema) => {
    fs.writeFileSync(export_path, JSON.stringify(schema, null, '\t'));
    console.log('Database structure successfully exported.');
    process.exit(1);
  });
