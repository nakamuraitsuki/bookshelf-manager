const sqlite3 = require('sqlite3').verbose();

// SQLiteデータベースの接続
const db = new sqlite3.Database('./db/mydatabase.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

module.exports = db;
