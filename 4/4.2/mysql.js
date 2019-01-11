var mysql = require('mysql');
var connection = mysql.createConnection({
  user: 'root',
  password: 'password'
});

connection.connect();

connection.query('CREATE TABLE quotes.quotes(' +
  'id TNT NOT NULL AUTO_INCREMENT, ' +
  'author VARCHAR(128) NOT NULL, ' +
  'quote TEXT NOT NULL, PRIMARY KEY(id)' +
  ')'
);

var ignore = [mysql.ERROR_DB_CREATE_EXISTS, mysql.ERROR_TABLE_EXISTS_ERROR];

connection.on('error', function(err) {
  if(ignore.indexOf(err.number) > -1) { return; }
  throw err;
});

connection.query('INSERT INTO quotes.quotes (' +
  'author, quote) ' +
  'VALUES("ビャーネ・ストロヴストルップ", "類推による証明は詐欺である");'
);
connection.end();