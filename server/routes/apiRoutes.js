const express = require('express');
const booksController = require('../controllers/booksController');

const router = express.Router();

// ブックリソースのエンドポイント
router.get('/books', booksController.getAllBooks);

module.exports = router;
