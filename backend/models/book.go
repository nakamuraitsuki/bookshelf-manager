package models

import (
	"time"
)

type Book struct {
	ID               int       `json:"id"`
	Title            string    `json:"title"`
	Author           string    `json:"author"`
	Publisher        string    `json:"publisher"`
	ISBN             string    `json:"isbn"`
	Quantity         int       `json:"quantity" gorm:"default:1"`
	AvailableQuantity int      `json:"available_quantity" gorm:"default:1"`
	CreatedAt        time.Time `json:"created_at"`
}