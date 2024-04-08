const express = require('express');
const db = require('./db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = process.env.PORT || 5000;

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// APIルートを使用する
app.use('/api', apiRoutes);

// サーバーを起動する
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
