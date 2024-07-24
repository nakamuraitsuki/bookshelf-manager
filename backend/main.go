package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

const (
	dbPath = "database.db"
	createTableQuery = `
		CREATE TABLE IF NOT EXISTS books (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			author TEXT NOT NULL,
			publisher TEXT NOT NULL,
			isbn TEXT NOT NULL,
			quantity INTEGER NOT NULL DEFAULT 1,
			available_quantity INTEGER NOT NULL DEFAULT 1,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	insertBookQuery = "INSERT INTO books (title, author, publisher, isbn, created_at) VALUES (?, ?, ?, ?, ?)"
	getBookHistoryQuery = `
		SELECT *
		FROM books 
		ORDER BY created_at DESC
		LIMIT 5;
	`
)

type Book struct {
	ID               int            `json:"id"`
	Title            string         `json:"title"`
	Author           string         `json:"author"`
	Publisher        string         `json:"publisher"`
	ISBN             string         `json:"isbn"`
	Quantity         int            `json:"quantity"`
	AvailableQuantity int            `json:"available_quantity"`
	CreatedAt        time.Time      `json:"created_at"`
}

func init() {
	db, err :=sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Println("データベース接続失敗",err)
		return
	}
	defer db.Close()

	_,err = db.Exec(createTableQuery)
	if err != nil {
		panic(err)
	}
}

func main() {
	db,err := sql.Open("sqlite3", dbPath)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	http.HandleFunc("/api/books", HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			createBook(w, r, db)
		case http.MethodGet:
			getBookHistory(w,r,db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	fmt.Println("http://localhost:8080でサーバーを起動します")
	http.ListenAndServe(":8080", nil)
}

func createBook(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var book Book
	if err := decodeBody(r, &book); err != nil {
		respondJSON(w, http.StatusBadRequest, err.Error())
		return
	}

	now := time.Now()

	result, err := db.Exec(insertBookQuery, book.Title, book.Author, book.Publisher, book.ISBN, now)
	if err != nil {
		panic(err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		panic(err)
	}

	book.ID = int(id)
	book.CreatedAt = now

	respondJSON(w, http.StatusCreated, book)
}

func getBookHistory(w http.ResponseWriter, _ *http.Request, db *sql.DB) {
	rows, err := db.Query(getBookHistoryQuery);
	fmt.Println("クエリ処理完了")
	if err != nil {
		panic(err)
	}
	defer rows.Close()
	var history  []Book

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.ISBN, &book.Quantity, &book.AvailableQuantity, &book.CreatedAt)
		if err != nil {
			log.Fatalln(err);
		}

		history = append(history, book)
	}
	fmt.Println("配列の用意完了")

	respondJSON(w, http.StatusOK,history);
	fmt.Println("return")
}

//以下触らない
func HandleCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// レスポンスヘッダーの設定
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// リクエストヘッダーの設定
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// ハンドラーの実行
		h(w, r)
	}
}

func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	// レスポンスヘッダーの設定
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	// レスポンスボディの設定
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		panic(err)
	}
}

func decodeBody(r *http.Request, v interface{}) error {
	// リクエストボディの読み込み
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		return err
	}
	return nil
}
