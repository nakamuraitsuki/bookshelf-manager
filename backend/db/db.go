package db

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"backend/models"
)

const dbPath = "database.db"

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open((sqlite.Open(dbPath)), &gorm.Config{})
	if err != nil {
		fmt.Println("データベース接続失敗", err)
		return
	}

	DB.AutoMigrate(&models.Book{}, &models.User{})
}