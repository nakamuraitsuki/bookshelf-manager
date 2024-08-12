import React from "react";
import { useState } from "react";
import styles from './Search.module.css'
import axios from "axios";
import { BookList, InputForm, SearchSwitch } from "../../components";


const SearchByAuthor = () =>{
    const [bookList,setBookList] = useState([]);

    const catchBookList = (e) =>{
        e.preventDefault();

        const author = e.target.elements.author.value;

        axios.get(`http://localhost:8080/api/search/byAuthor?author=${author}`)
        .then((response) =>{
            setBookList(response.data);
        })
        .catch((error)=>{
            console.error("getListeError:",error);
        })
    };

    return (
        <div>
            <h1 className={styles.title}>著者から検索</h1>
            <div className={styles.container}>
                <p className={styles.containerP}>検索方法</p>
                <SearchSwitch
                    left="タイトル"
                    right="著者"
                    to="/search/byTitle"
                    selected = {false}
                />                
            </div>

            <InputForm
                placeholder="キーワードを入力"
                buttonText="検索"
                onSubmit={catchBookList}
                inputLabel="著者"
                id="author"
                type="text"
                maxLength={100}
                minLength={1}
                required
            />
            <BookList listTitle="検索結果" bookList={bookList}/>
        </div>
    );
}

export default SearchByAuthor;