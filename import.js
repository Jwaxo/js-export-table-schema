/**
 * @file
 * import.js
 *
 * Oh sure, why wouldn't you want to import what you already exported?
 *
 * @usage
 * node import.js
 */

const mysql = require('mysql');
const dbdiff = require('dbdiff');

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

const db_description = `mysql://${database.user}:${database.password}@${database.host}/${database.database}`;

dbdiff.describeDatabase(db_description)
  .then((schema) => {
    // Get the information exported to the export path.
    const tableSchema = require('./' + export_path);
    // Get the difference between the current database and the exported database.
    // dbdiff's magic is such that it creates the necessary MySQL ALTER commands
    // necesssary to make one DB into the other.

    // If we're starting fresh, the difference will be everything!
    const diff = new dbdiff.DbDiff();
    diff.compareSchemas(schema, tableSchema);

    // Basically, we want to split out all of the commands to individual ones,
    // so we're not sending just one gigantic query to the server.
    const commands = diff.commands('drop').split(';');
    for (let i = 0; i < commands.length; i++) {
      commands[i] = commands[i].replace(' DEFAULT_GENERATED', '');
    }
    if (commands.length > 0) {
      // Then loop through the queries and run them.
      for (let query of commands) {
        if (query.trim()) {
          db.getConnection((connect_error, connection) => {
            if (connect_error) {
              console.log('Error getting connection from pool');
              throw connect_error;
            }
            connection.query(query, [], (error, results) => {
              if (error) {
                console.log('Error running multiple queries');
                throw error;
              }
              connection.release();
            });
          });
        }
      }
      console.log('DB Import Complete!');
    }
  });
