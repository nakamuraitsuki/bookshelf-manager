package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"
)

func BorrowBook(w http.ResponseWriter, r *http.Request) {
	var loan models.Loan
	if err := decodeBody(r, &loan); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	loan.LoanDate = time.Now()

	if err := db.DB.Create(&loan).Error; err != nil {
		http.Error(w, "Failed to borrow book", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK,loan)

}

func ReturnBook(w http.ResponseWriter, r *http.Request) {
	var loan models.Loan
	if err := decodeBody(r, &loan); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	now := time.Now()
	loan.ReturnDate = &now

	if err := db.DB.Model(&loan).Where("id = ?", loan.ID).Update("return_date", loan.ReturnDate).Error; err != nil {
		http.Error(w, "Failed to return book ", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, loan)
}