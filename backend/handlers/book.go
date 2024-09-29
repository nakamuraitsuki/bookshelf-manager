package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"backend/db"
	"backend/models"
)

/*Bookテーブル-データ追加*/
func CreateBook(w http.ResponseWriter, r *http.Request) {
	var book models.Book
	/*情報受け取り*/
	if err := decodeBody(r, &book); err != nil {
		respondJSON(w, http.StatusBadRequest, err.Error())
		return
	}
	/*データ追加*/
	if err := db.DB.Create(&book).Error; err != nil {
		respondJSON(w,http.StatusInternalServerError,err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, book)
}

/*Bookテーブル-追加履歴（過去5件）取得*/
func GetBookHistory(w http.ResponseWriter, _ *http.Request) {
	var history  []models.Book
	if err := db.DB.Order("id desc").Limit(3).Find(&history).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK,history);
}

/*Bookテーブル-IDから情報取得*/
func GetBookByID(w http.ResponseWriter, r *http.Request) {
	/*APIからid取得*/
	path := strings.TrimPrefix(r.URL.Path, "/api/books/")
	id := strings.TrimSpace(path)

	if id == "" {
		http.Error(w,"ID paramaeter is missing",http.StatusBadRequest)
		return
	}

	/*dbから取得*/
	var book models.Book 
	if err := db.DB.First(&book, id).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK,book);
}

/*Bookテーブル-タイトルあいまい検索*/
func GetBookByTitle(w http.ResponseWriter, r *http.Request) {
	/*APIからタイトル取得*/
	query := r.URL.Query()
	title := query.Get("title")
	title = "%" + title + "%"

	var books []models.Book;
	if err := db.DB.Where("title LIKE ?", title).Limit(5).Find(&books).Error; err != nil {
		respondJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK,books);
}

/*Bookテーブル-著者あいまい検索*/
func GetBookByAuthor(w http.ResponseWriter, r *http.Request) {
	/*APIから著者取得*/
	query := r.URL.Query()
	author := query.Get("author")
	author = "%" + author + "%"

	var books []models.Book;
	if err := db.DB.Where("author LIKE ?", author).Limit(5).Find(&books).Error; err != nil {
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
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

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

