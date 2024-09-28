#!/bin/bash

# Reactフロントエンド起動
echo "フロントエンド起動中"
cd frontend
npm start &

# Goバックエンドのビルド＋起動
echo "バックエンド起動中"
cd ../backend
go run main.go &

echo "起動しました"
echo "API endpoints are available at http://localhost:8080/"

wait
