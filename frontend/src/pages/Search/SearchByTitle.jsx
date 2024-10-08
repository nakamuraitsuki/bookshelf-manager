import React from "react";
import { useState } from "react";
import { InputForm } from "../../components";
import { BookList } from "../../components";
import { SearchSwitch } from "../../components";
import styles from "./Search.module.css"
import axios from "axios";

const SearchByTitle = () =>{
    const [bookList,setBookList] = useState([]);

    const catchBookList= (e) =>{
        e.preventDefault();

        const title = e.target.elements.title.value;
        axios.get(`http://localhost:8080/api/search/byTitle?title=${title}`)
        .then((response) => {
            setBookList(response.data);
        })
        .catch((error)=>{
            console.error("searchError:",error);
        })
    };

    return(
        <div className={styles.field}>
            <h1 className={styles.title}>タイトルから検索</h1>
            <div className={styles.container}>
                <p className={styles.containerP}>検索方法</p>
                <SearchSwitch
                    left="タイトル"
                    right="著者名"
                    to="/search/byAuthor"
                    switched 
                />
            </div>

            <InputForm
                placeholder="キーワードを入力"
                buttonText="検索"
                onSubmit={catchBookList}
                inputLabel="タイトル"
                id="title"
                type="text"
                maxLength={100}
                minLength={1}
                required
            />
            <BookList listTitle="検索結果" bookList={bookList}/>
        </div>
    );
};

export default SearchByTitle;