import React ,{useState, useEffect} from "react";
import styles from "./Add.module.css"
import { BookList } from "../../components"
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


    const catchBookInfo = (e) => {
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
            console.log('国会図書館より', bookTitle);
            e.target.reset();
        })
        .catch(error => {
            setError('書籍情報の取得に失敗しました');
            console.error('APIerror:', error);
        })
        
    }
    
    const addBook = (bookInfo) => {
        if(bookInfo) {
            axios
                .post("http://localhost:8080/api/books", bookInfo)
                .then((response) => {
                    console.log(response.data)
                    //追加するたびに履歴配列を更新
                    getBookHistory();
                })
                .catch((error) => {
                    console.log("Error:",error);
                });
        }
    }

    const getBookHistory = () => {
        axios.get("http://localhost:8080/api/books").then((response)=>{
            setBookHistory(response.data);
            console.log("return1",response.data);
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
        addBook(bookInfo);
    }, [bookInfo])


    return (
        <div className={styles.field}>
            <h1>Add page</h1>
            <div>
                <form onSubmit={catchBookInfo}>
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
            <BookList listTitle="追加履歴" bookList={bookHistory}/>
        </div>
    );
};

export default Add;