package handlers

import (
	"net/http"
	"github.com/dgrijalva/jwt-go"
	"fmt"
)

/*CORS設定ミドルウェア*/
func HandleCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// レスポンスヘッダーの設定
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// リクエストヘッダーの設定
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// ハンドラーの実行
		h(w, r)
	}
}

/*認証ミドルウェア。ルーティングで使う*/
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		tokenString := r.Header.Get("Authorization")
		if tokenString == ""{
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		/*検証*/
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error){
			/*JWTの署名方法確認*/
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unxpected signing method: %v", token.Header["alg"])
			}

			/*鍵返却*/
			return []byte("nakamura"),nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		next(w,r)/*トークン有効なら次のハンドラーを呼ぶ*/
	}
}