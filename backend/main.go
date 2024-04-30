package main

import (
	"database/sql"
	"fmt"

	_"github.com/mattn/go-sqlite3"
)

func main() {
	dbPath := "my-database.db"

	db, err :=sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Println("データベース接続失敗",err)
		return
	}
	defer db.Close()
	fmt.Println("データベースに接続しました")
}