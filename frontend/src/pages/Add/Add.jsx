import React ,{useState, useEffect} from "react";
import styles from "./Add.module.css"
import axios from 'axios';
import {XMLParser} from 'fast-xml-parser';

const Add = () => {
    const parser = new XMLParser({
        ignoreAttributes:false,
        attributeNamePrefix: '',
    });
    //本の情報を入れるやつ
    const [bookInfo,setBookInfo] = useState(null);
    //追加履歴配列
    const [bookHistory,setBookHistory] = useState([]);
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
    
    const getBookHistory = () => {
        axios.get("http://localhost:8080/api/books").then((response)=>{
            setBookHistory(response.data);
            console.log("return",response);
        })
        .catch((error) =>{
            console.error("Error:",error);
        })
    };


    useEffect(() => {
        getBookHistory();
    },[]);


    useEffect(() => {
        //bookInfoの値が変わったらその値をデータベースに追加する．
        if(bookInfo) {
            axios
                .post("http://localhost:8080/api/books", bookInfo)
                .then((response) => {
                    console.log(response.data)
                    getBookHistory();
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
                <h2>追加履歴</h2>
                {bookHistory.map((book)=>(
                    <div key={book.id}>
                        <p>{book.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Add;