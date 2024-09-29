package models

import "time"

type CurrentLoan struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;index"`  
	BookID    uint      `gorm:"not null:omdex"`  
	LoanDate  time.Time `gorm:"not null"`  
	Book      Book      `gorm:"foreignKey:BookID"`
	User      User      `gorm:"foreignKey:UserID"`
}
