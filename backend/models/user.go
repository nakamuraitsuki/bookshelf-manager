package models

import (
	"time"
)

type User struct {
	ID          int       `json:"id"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	IconURL		string	  `json:"iconURL"`
	PasswordHash string    `json:"password_hash"`
	CreatedAt   time.Time `json:"created_at"`
}
