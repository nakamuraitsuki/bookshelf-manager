package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"
	"log"
	"strconv"
	"gorm.io/gorm"
)

/*貸出処理ーuserID+bookIDを受け取る*/
func BorrowBook(w http.ResponseWriter, r *http.Request) {
	
	type Info struct {
		UserID	int		`json:"user_id"`
		BookID  int     `json:"book_id"`
	}

	var info Info

	if err := decodeBody(r, &info); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	loan := models.Loan{
		UserID: uint(info.UserID), 
		BookID: uint(info.BookID),
		LoanDate: time.Now(),
	}

	currentLoan := models.CurrentLoan{
		UserID: uint(info.UserID),
		BookID: uint(info.BookID),
		LoanDate: time.Now(),
	}
	

	if err := db.DB.Create(&loan).Error; err != nil {
		http.Error(w, "Failed to borrow book", http.StatusInternalServerError)
		return
	}

	if err := db.DB.Create(&currentLoan).Error; err != nil {
		http.Error(w, "Failed to borrow book", http.StatusInternalServerError)
		return
	}

	if err := db.DB.Model(&models.Book{}).
					Where("id = ?", info.BookID).
					Update("available_quantity", gorm.Expr("available_quantity - ?", 1)).Error; 
	err != nil {
		http.Error(w, "Failed to borrow book", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK,info)

}

/*返却ーuserID+bookID*/
func ReturnBook(w http.ResponseWriter, r *http.Request) {
	type Info struct {
		UserID	int		`json:"user_id"`
		BookID  int     `json:"book_id"`
	}

	var info Info

	if err := decodeBody(r, &info); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := db.DB.Model(&models.CurrentLoan{}).
					Where("user_id = ? AND book_id = ?", info.UserID, info.BookID).
					Delete(&models.CurrentLoan{}).
					Error; 
	err != nil {
		http.Error(w, "Failed return", http.StatusInternalServerError)
		return
	}
	db.DB.Model(&models.Book{}).Where("id = ?", info.BookID).Update("available_quantity", gorm.Expr("available_quantity + ?", 1))

	if err := db.DB.Model(&models.Loan{}).Where("user_id = ? AND book_id = ?", info.UserID, info.BookID).
	Update("return_date", time.Now()).Error; err != nil {
		http.Error(w, "failed", http.StatusInternalServerError)
		return  
    }

	respondJSON(w, http.StatusOK, info)
}

/*現在の貸出状況を取得*/
func GetCurrentLoan(w http.ResponseWriter, r *http.Request) {
	log.Println("関数が発火しました")
	userIDStr := r.URL.Query().Get("userID")
	bookIDStr := r.URL.Query().Get("bookID")
	log.Println("IDを抜き取りました",userIDStr,bookIDStr)
	// クエリパラメータを整数に変換
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	bookID, err := strconv.ParseUint(bookIDStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid book ID", http.StatusBadRequest)
		return
	}
	log.Println("整数に直しました")
	var currentLoan models.CurrentLoan
	if err := db.DB.Where("user_id = ? AND book_id = ?", userID, bookID).First(&currentLoan).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "No current loan found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to retrieve loan information", http.StatusInternalServerError)
		return
	}
	log.Println("探索しました")
	respondJSON(w, http.StatusOK, currentLoan)
}
