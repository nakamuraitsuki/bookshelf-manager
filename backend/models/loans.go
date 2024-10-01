package models

import "time"

type Loan struct {
	ID		uint	`gorm:"primaryKey"`
	UserID	uint	`gorm:"not null;index"`
	BookID	uint	`gorm:"not null;index"`
	LoanDate	time.Time	`gorm:"not null"`
	ReturnDate	*time.Time	

	User	User	`gorm:"foreignKey:UserID"`
	Book	Book	`gorm:"foreignKey:BookID"`
}