package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username	string	`json:"username"`
	Password	string	`json:"password"`
	Email		string 	`json:"email"`
}

type LoginRequest struct {
	Username	string	`json:"username"`
	Password	string	`json:"password"`
}

var jwtSecret = []byte("nakamura")/*環境変数での管理を検討中*/

/*ユーザー登録*/
func Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest

	/*リクエスト読み取り*/
	if err := decodeBody(r, &req); err != nil {
		http.Error(w, "Invalid input",http.StatusBadRequest)
		return
	}
	/*パスワードハッシュ化*/
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	user := models.User{
		Username: 		req.Username,
		Email: 			req.Email,
		IconURL: 		"https://cdn-icons-png.flaticon.com/512/9131/9131478.png",/*初期アイコン*/
		PasswordHash: 	string(hashedPassword),
		CreatedAt: 		time.Now(),
	}

	/*データベースに保存*/
	if err := db.DB.Create(&user).Error; err != nil {
		http.Error(w, "Failed to create ser", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusCreated, map[string]string{
		"message":"User registered successfully",
	})
}

/*ログイン*/
func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	/*読み取り*/
	if err := decodeBody(r, &req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	/*User取得*/
	var user models.User
	if err := db.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	/*ハッシュ化戻して比較*/
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash),[]byte(req.Password)); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	/*jwtトークン関連*/

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":	user.ID,
		"exp":	time.Now().Add(time.Hour * 72).Unix(),/*有効期限*/
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{
		"token": tokenString,
	})

	
}

/*ログインしてるユーザーの情報を取ってくる*/
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authrization header is missing", http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	/*tokenを元にID取得*/
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error){
		return []byte("nakamura"), nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Invalid claims", http.StatusUnauthorized)
		return
	}


	userID := claims["sub"].(float64)

	var user models.User
	if err := db.DB.First(&user, userID).Error; err != nil{
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	respondJSON(w, http.StatusOK, user)
}

/*ユーザー情報編集*/
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	var userUpdates struct {
		ID			int		`json:"id"`
		Username	string	`json:"username"`
		IconURL		string	`json:"iconURL"`
	}

	if err := decodeBody(r, &userUpdates); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := db.DB.Model(&models.User{}).Where("id = ?", userUpdates.ID).Updates(models.User{
		Username: 	userUpdates.Username,
		IconURL:	userUpdates.IconURL,
	}).Error; err != nil {
		http.Error(w, "Failed to update", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK,userUpdates)
}

