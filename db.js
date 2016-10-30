let fs = require('fs');
let sql = require('sql.js');

const DB_NAME = 'db.sqlite';
const CREATE_TABLE_PERSONS = 'CREATE TABLE IF NOT EXISTS tbl_persons(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, email TEXT, tel TEXT);';
const INSERT_PERSON = 'INSERT INTO tbl_persons(name, email, tel) VALUES(:name, :email, :tel);';

let dbPath = '';

let db = null;
let stmt = null;

// Create tables, statements
function init() {
  db.run(CREATE_TABLE_PERSONS);
  stmt = db.prepare(INSERT_PERSON);
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

function add(values = {':name': '', ':email': '', ':tel': ''}) {
  stmt.run(values);
}

module.exports.open = open;
module.exports.close = close;
module.exports.add = add;
