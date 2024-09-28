package main

import (
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
	"backend/db"
	"backend/handlers"
)

func main() {
	db.InitDB()

	http.HandleFunc("/api/books", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			handlers.CreateBook(w, r)
		case http.MethodGet:
			handlers.GetBookHistory(w,r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/books/", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetBookByID(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/search/byTitle", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		handlers.GetBookByTitle(w,r);
	}))

	http.HandleFunc("/api/search/byAuthor", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		handlers.GetBookByAuthor(w,r);
	}))

	/*ユーザー登録*/
	http.HandleFunc("/api/register", handlers.HandleCORS(handlers.Register))
	/*ログイン*/
	http.HandleFunc("/api/login", handlers.HandleCORS(handlers.Login))

	fmt.Println("http://localhost:8080でサーバーを起動します")
	http.ListenAndServe(":8080", nil)
}

