import React ,{useState, useEffect} from "react";
import styles from "./Add.module.css"
import {createRoutesFromElements, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {XMLParser, XMLBuilder} from 'fast-xml-parser';

const Add = () => {
    const navigate = useNavigate();
    const parser = new XMLParser({
        ignoreAttributes:false,
        attributeNamePrefix: '',
    });
    const [bookInfo,setBookInfo] = useState(null);
    const [error,setError] = useState(null);

    function addBook() {
        //入力を取ってくる
        const isbn = document.querySelector('input[name="isbn"]').value;
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


        })
        .catch(error => {
            setError('書籍情報の取得に失敗しました');
            console.error('APIerror:', error);
        })
        


        //とりあえずホーム画面に戻す後々確認画面に飛ばすようにしたい
        //navigate('/');
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
                {/*TODO:10桁又は13桁の数字しか入れられないようにする（空白を許さない） */}
                <label>ISBN:<input id="isbn" name="isbn" type="text"/></label>                
            </div>
            <div className={styles.submitButton}>
                <label>
                    <input 
                        type="submit" 
                        name="isbnSubmit" 
                        value="追加する"
                        onClick={addBook}
                    />
                </label>
            </div>

        </div>
    );
};

export default Add;