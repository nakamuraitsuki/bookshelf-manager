// 必要なモジュールをインポート
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Expressアプリケーションを作成
const app = express();

// JSONリクエストをパースするためのミドルウェアを設定
app.use(bodyParser.json());

// SQLite3データベースの接続
const db = new sqlite3.Database('book.db');

// POSTリクエストを処理するエンドポイントを設定
app.post('/books', (req, res) => {
  const { title, author, isbn } = req.body; // リクエストボディから情報を取得

  // データベースに蔵書を追加するクエリを実行
  const sql = 'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)';
  db.run(sql, [title, author, isbn], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('蔵書の追加に失敗しました');
    } else {
      res.status(201).send('蔵書が追加されました');
    }
  });
});

// サーバーをポート3000で起動
app.listen(3000, () => {
  console.log('サーバーが起動しました');
});
