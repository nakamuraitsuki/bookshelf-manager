import React ,{useState, useEffect} from "react";
import styles from "./Add.module.css"
import axios from 'axios';
import {XMLParser} from 'fast-xml-parser';

const Add = () => {
    const parser = new XMLParser({
        ignoreAttributes:false,
        attributeNamePrefix: '',
    });
    const [bookInfo,setBookInfo] = useState(null);
    const [error,setError] = useState(null);

    const addBook = (e) => {
        e.preventDefault();
        //formの中の、要素のうちのisbnの、valueを取ってくる
        const isbn = e.target.elements.isbn.value;
        //国立国会図書館API
        const endpoint = `https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&maximumRecords=1&query=isbn%3D${isbn}`;

        axios.get(endpoint)
        .then(response => {
            //データ構造の都合で2回パース
            const parsedData = parser.parse(response.data);
            const recordData = parsedData.searchRetrieveResponse.records.record.recordData;
            const bookParsedData = parser.parse(recordData);
            //それぞれを格納
            const bookTitle = bookParsedData['srw_dc:dc']['dc:title'];
            const bookAuthor = bookParsedData['srw_dc:dc']['dc:creator'];
            const bookPublisher = bookParsedData['srw_dc:dc']['dc:publisher'];
            
            setBookInfo({ Title: bookTitle, Author: bookAuthor, Publisher: bookPublisher, ISBN: isbn});

            //デバック用
            console.log('title:', bookTitle);
            e.target.reset();
        })
        .catch(error => {
            setError('書籍情報の取得に失敗しました');
            console.error('APIerror:', error);
        })
        
    }
    
    useEffect(() => {
        if(bookInfo) {
            axios
                .post("http://localhost:8080/api/posts", bookInfo)
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log("Error:",error);
                });
        }
    }, [bookInfo])

    return (
        <div className={styles.Title}>
            <h1>Add page</h1>
            <div>
                <form onSubmit={addBook}>
                    <label className={styles.inputLabel}>ISBN</label>
                    <input
                        className={styles.inputBox}
                        id="isbn"
                        name="isbn"
                        type="number"
                        required
                        maxLength={13}
                        minLength={10}
                        placeholder="ISBNを入力"
                    />
                    <button
                        className={styles.submitButton} 
                        type="submit"
                    >
                        追加
                    </button>
                </form>
            </div>
            <div>
                <h1>追加履歴</h1>
            </div>
        </div>
    );
};

export default Add;