const db = require('../db');

// 全てのブックを取得するコントローラー
exports.getAllBooks = (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      res.status(500).send('Database query error');
    } else {
      res.json(rows);
    }
  });
};
