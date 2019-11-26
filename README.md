# js-export-table-schema

A simple way to export and import table configurations via Node JS

## Installation

1. Clone this repo:  
`git clone git@github.com:Jwaxo/js-export-table-schema.git`
2. Enter the directory:  
`cd js-export-table-schema`
3. Run NPM.  
`npm install`
4. Done!

## Usage
This repo, despite being named "export table schema", can both export and import. The default index.js exports; the import.js imports. Because both functions are extremely basic, you need to configure them both individually.

### Exporting
1. Edit `index.js` in your favorite editor.
2. Update the `database` variable on line 20 to match your local database with a user that can READ the db. If you do not yet have this information, this repo is not for you.
3. (Optional) Update the `export_path` variable to match a path you'd prefer the exported database to be.
4. Save the changed file.
5. Run `node index.js` or `node .`.
6. After running, your database should now be exported to `table-schema.json`, or whatever you renamed it in step 3.

### Importing
1. Export your database (or provide your own .json file with an exported database).
2. Edit `import.js` in your favorite editor.
3. Update the `database` variable on line 19 to match your local database with a user that can WRITE to the db. If you do not yet have this information, this repo is not for you.
4. Update the `export_path` variable to match the path of your exported databse in step 1.
5. Save the changed file.
6. Run `node import.js`.
7. After running, your databse should now be imported.
