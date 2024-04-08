import cv2
import pytesseract
import requests

# 画像ファイルのパス
image_path = 'path_to_your_image.jpg'

# 画像の読み込み
image = cv2.imread(image_path)

# 画像をグレースケールに変換
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 画像のテキスト認識（OCR）
extracted_text = pytesseract.image_to_string(gray_image)

# ISBNの抽出（例として"ISBN"の文字列が含まれる場合）
isbn_index = extracted_text.find('ISBN')
if isbn_index != -1:
    isbn = extracted_text[isbn_index + 5:isbn_index + 20]  # ISBNの長さに応じて調整

    # Open Library APIを使用して書籍情報を取得
    def get_book_info(isbn):
        url = f'https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&jscmd=data&format=json'
        try:
            response = requests.get(url)
            data = response.json()
            if f'ISBN:{isbn}' in data:
                book_data = data[f'ISBN:{isbn}']
                title = book_data['title']
                authors = [author['name'] for author in book_data.get('authors', [])]
                published_date = book_data.get('publish_date', '')
                description = book_data.get('description', '')
                return {
                    'title': title,
                    'authors': ', '.join(authors),
                    'published_date': published_date,
                    'description': description
                }
            else:
                return None
        except Exception as e:
            print(f"Error: {e}")
            return None

    # 書籍情報を取得する
    book_info = get_book_info(isbn)

    if book_info:
        print("書籍情報を取得しました:")
        print(f"タイトル: {book_info['title']}")
        print(f"著者: {book_info['authors']}")
        print(f"出版日: {book_info['published_date']}")
        print(f"概要: {book_info['description']}")
    else:
        print("書籍情報が見つかりませんでした。")
else:
    print("ISBNが画像から読み取れませんでした。")
