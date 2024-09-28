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
			handlers.CreateBook(w, r, db.DB)
		case http.MethodGet:
			handlers.GetBookHistory(w,r,db.DB)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/books/", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetBookByID(w, r, db.DB)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/search/byTitle", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		handlers.GetBookByTitle(w,r,db.DB);
	}))

	http.HandleFunc("/api/search/byAuthor", handlers.HandleCORS(func(w http.ResponseWriter, r *http.Request) {
		handlers.GetBookByAuthor(w,r,db.DB);
	}))

	fmt.Println("http://localhost:8080でサーバーを起動します")
	http.ListenAndServe(":8080", nil)
}

