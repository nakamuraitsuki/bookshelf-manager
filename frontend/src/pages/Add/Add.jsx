import React ,{useState} from "react";
import styles from "./Add.module.css"
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Add = () => {
    const navigate = useNavigate();
    const [bookInfo,setBookInfo] = useState(null);
    const [error,setError] = useState(null);
    //const corsProxy = 'https://cors-anywhere.herokuapp.com/';//CORSプロキシ
    function addBook() {
        //入力を取ってくる
        const isbn = document.querySelector('input[name="isbn"]').value;
        const endpoint = `https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&maximumRecords=10&query=title%3d%22%E6%A1%9C%22%20AND%20from%3d%222018%22`;

        axios.get(endpoint)
        .then(response => {
            setBookInfo(response.data);
            console.log('ok');
        })
        .catch(error => {
            setError('書籍情報の取得に失敗しました');
            console.error('APIerror:', error);
        });

        //とりあえずホーム画面に戻す後々確認画面に飛ばす
        //navigate('/');
    }

    return (
        <div className={styles.Title}>
            <h1>Add page</h1>
            <div>
                {/*TODO:10桁又は13桁の数字しか入れられないようにする（空白を許さない） */}
                <label>ISBN:<input id="isbn" name="isbn" type="number"/></label>                
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