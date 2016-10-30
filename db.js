let fs = require('fs');
let sql = require('sql.js');

const DB_NAME = 'data.db';
let dbPath = '';

let db = null;

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
  }
}

function close() {
  let buffer = new Buffer.from(db.export());
  fs.writeFileSync(dbPath, buffer);
}

module.exports.open = open;
module.exports.close = close;
