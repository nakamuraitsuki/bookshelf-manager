import cv2
import pytesseract

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

print(isbn)
