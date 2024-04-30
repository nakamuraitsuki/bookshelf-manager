package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

type Book struct {
	ID int `db:"id"`
	Name string `db:"name"`
	Author string `db:"author"`
	Publisher string `db:"publisher"`
	CreatedAt int64 `db:"created_at"`
	Isbn int64 `db:"isbn"`
}

type Booklist []Book

var db *sqlx.DB

func main() {
	db = dbConnect()
	defer db.Close()
	err := initDB()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Starting server at port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func dbConnect () *sqlx.DB {
	//sqlite3のデータベースに接続
	db, err := sqlx.Connect("sqlite3", "./books.db")
	if err != nil {
		log.Fatal(err)
	}

	return db
}

func initDB() error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS bookList (
		id INTEGER PRIMARY KEY,
		name TEXT,
		author TEXT,
		publisher TEXT,
		created_at INTEGER,
		isbn INTEGER
	)`)
	if err != nil {
		log.Print(err)
		return err
	}
	return nil
}

