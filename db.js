let fs = require('fs');
let sql = require('sql.js');

const DB_NAME = 'db.sqlite';
const CREATE_TABLE_PERSONS = 'CREATE TABLE IF NOT EXISTS tbl_persons(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, email TEXT, tel TEXT);';
const INSERT_PERSON = 'INSERT INTO tbl_persons(name, email, tel) VALUES(:name, :email, :tel);';
const SELECT_PERSON_ALL = 'SELECT id, name, email, tel FROM tbl_persons;';
const SELECT_PERSON_SINGLE = 'SELECT id, name, email, tel FROM tbl_persons WHERE id=:id;';
const SELECT_PERSON_FILTERED = `SELECT id, name, email, tel FROM tbl_persons WHERE name LIKE :value OR email LIKE :value OR tel LIKE :value;`;
const UPDATE_PERSON = 'UPDATE tbl_persons SET name=:name, email=:email, tel=:tel WHERE id=:id;';
const DELETE_PERSON = 'DELETE FROM tbl_persons WHERE id=:id;';

let dbPath = '';
let db = null;

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
    db.run(CREATE_TABLE_PERSONS); // Create table if not exists
  }
}

// Save the database to disk as a file
function close() {
  let buffer = new Buffer.from(db.export());
  fs.writeFileSync(dbPath, buffer);
}

function add(values = {':name': '', ':email': '', ':tel': ''}) {
  let stmt = db.prepare(INSERT_PERSON);
  stmt.run(values);
  stmt.free();
}

function getAll() {
  return getFiltered();
}

function getFiltered(value = '') {
  value = '%' + value + '%';

  let stmt = db.prepare(SELECT_PERSON_FILTERED);
  stmt.bind({':value': value});

  let result = [];
  while (stmt.step()) {
    result.push(stmt.getAsObject());
  }

  stmt.free();

  return result;
}

function getSingle(values) {
  let stmt = db.prepare(SELECT_PERSON_SINGLE);

  stmt.step();
  let result = stmt.getAsObject(values);

  stmt.free();

  return result;
}

function edit(values) {
  let stmt = db.prepare(UPDATE_PERSON);
  stmt.run(values);
  stmt.free();

  return getSingle(values);
}

function deletePerson(values) {
  let stmt = db.prepare(DELETE_PERSON);
  stmt.run(values);
  stmt.free();
}

module.exports.open = open;
module.exports.close = close;
module.exports.add = add;
module.exports.getAll = getAll;
module.exports.getSingle = getSingle;
module.exports.getFiltered = getFiltered;
module.exports.edit = edit;
module.exports.delete = deletePerson;
