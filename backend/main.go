package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "github.com/mattn/go-sqlite3"
)

const	dbPath = "database.db"

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

type User struct {
	ID				int				`json:"id"`
	Username		string			`json:"username"`
	Email			string			`json:"email"`
	PasswordHash	string			`json:"password_hash"`
	CreatedAt		time.Time		`json:"created_at"`
}

var db *gorm.DB

func init() {
	var err error
	db, err = gorm.Open(sqlite.Open(dbPath),&gorm.Config{})
	if err != nil {
		fmt.Println("データベース接続失敗",err)
		return
	}
	
	db.AutoMigrate(&Book{}, &User{})
}

func main() {
	db,err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic(err)
	}

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

	http.HandleFunc("/api/search/byAuthor", HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		getBookByAuthor(w,r,db);
	}))

	fmt.Println("http://localhost:8080でサーバーを起動します")
	http.ListenAndServe(":8080", nil)
}

/*Bookテーブル-データ追加*/
func createBook(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var book Book
	/*情報受け取り*/
	if err := decodeBody(r, &book); err != nil {
		respondJSON(w, http.StatusBadRequest, err.Error())
		return
	}
	/*データ追加*/
	if err := db.Create(&book).Error; err != nil {
		respondJSON(w,http.StatusInternalServerError,err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, book)
}

/*Bookテーブル-追加履歴（過去5件）取得*/
func getBookHistory(w http.ResponseWriter, _ *http.Request, db *gorm.DB) {
	var history  []Book
	if err := db.Order("id desc").Limit(5).Find(&history).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK,history);
}

/*Bookテーブル-IDから情報取得*/
func getBookByID(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	/*APIからid取得*/
	path := strings.TrimPrefix(r.URL.Path, "/api/books/")
	id := strings.TrimSpace(path)

	if id == "" {
		http.Error(w,"ID paramaeter is missing",http.StatusBadRequest)
		return
	}

	/*dbから取得*/
	var book Book 
	if err := db.First(&book, id).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK,book);
}

/*Bookテーブル-タイトルあいまい検索*/
func getBookByTitle(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	/*APIからタイトル取得*/
	query := r.URL.Query()
	title := query.Get("title")
	title = "%" + title + "%"

	var books []Book;
	if err := db.Where("title LIKE ?", title).Limit(5).Find(&books).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK,books);
}

/*Bookテーブル-著者あいまい検索*/
func getBookByAuthor(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	/*APIから著者取得*/
	query := r.URL.Query()
	author := query.Get("author")
	author = "%" + author + "%"

	var books []Book;
	if err := db.Where("author LIKE ?", author).Limit(5).Find(&books).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
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
