package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"log"
	"strings"

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
	getBookInfoQuery = "SELECT * FROM books WHERE id = ?"
	getBookByTitleQuery = "SELECT * FROM books WHERE title LIKE ?"
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

	http.HandleFunc("/api/books/", HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getBookByID(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/search/byTitle", HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		getBookByTitle(w,r,db);
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

	if err != nil {
		panic(err)
	}
	defer rows.Close()
	var history  []Book

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.ISBN, &book.Quantity, &book.AvailableQuantity, &book.CreatedAt)
		if err != nil {
			log.Fatalln("GetHistryError",err);
		}

		history = append(history, book)
	}

	respondJSON(w, http.StatusOK,history);
}

func getBookByID(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	fmt.Println("get step 1")
	path := strings.TrimPrefix(r.URL.Path, "/api/books/")
	id := strings.TrimSpace(path)

	if id == "" {
		http.Error(w,"ID paramaeter is missing",http.StatusBadRequest)
		return
	}
	fmt.Println("get step 2")
	row := db.QueryRow(getBookInfoQuery,id);

	fmt.Println("get step 3")
	var book Book 
	err := row.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.ISBN, &book.Quantity, &book.AvailableQuantity, &book.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Book not found", http.StatusNotFound)
		} else {
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return		
	}
	fmt.Println("get step 4")
	respondJSON(w, http.StatusOK,book);
}

func getBookByTitle(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	query := r.URL.Query()
	title := query.Get("title")
	title = "%" + title + "%"

	rows, err := db.Query(getBookByTitleQuery,title);
	if err != nil {
		panic(err);
	}
	defer rows.Close();

	var books []Book;

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.ISBN, &book.Quantity, &book.AvailableQuantity, &book.CreatedAt)
		if err != nil {
			log.Fatalln("GetListError",err);
		}

		books = append(books, book);
	}

	respondJSON(w, http.StatusOK,books);
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
