let fs = require('fs');
let sql = require('sql.js');

const DB_NAME = 'db.sqlite';
let dbPath = '';

let db = null;

// Create tables
function init() {
  let qStr = 'CREATE TABLE IF NOT EXISTS tbl_persons(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, email TEXT, tel TEXT);';

  db.run(qStr);
}

// Read database from disk and open in memory
function open(path = '', name = DB_NAME) {
  dbPath = path + '/' + name;

  let fileBuffer = null;

  try {
    fileBuffer = fs.readFileSync(dbPath);
  } catch(ex) {
    fs.writeFileSync(dbPath, new Buffer.from(''));
    fileBuffer = fs.readFileSync(dbPath);
  }

  if (fileBuffer) {
    db = new sql.Database(fileBuffer);
    init();
  }
}

// Save the database to disk as a file
function close() {
  let buffer = new Buffer.from(db.export());
  fs.writeFileSync(dbPath, buffer);
}

module.exports.open = open;
module.exports.close = close;
