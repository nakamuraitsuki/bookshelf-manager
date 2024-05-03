package main

import (
	"database/sql"
	"fmt"

	_"github.com/mattn/go-sqlite3"
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
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
)

func init() {
	db, err :=sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Println("データベース接続失敗",err)
		return
	}
	defer db.Close()

}
func main() {
	fmt.Println("データベースに接続しました")
}