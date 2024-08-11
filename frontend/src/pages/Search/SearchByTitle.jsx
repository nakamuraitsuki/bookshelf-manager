import React from "react";
import { useState } from "react";
import { InputForm } from "../../components";
import { BookList } from "../../components";
import styles from "./SearchByTitle.module.css"
import axios from "axios";

const SearchByTitle = () =>{
    const [bookList,setBookList] = useState([]);

    const catchBookList= (e) =>{
        e.preventDefault();

        const title = e.target.elements.title.value;
        axios.get(`http://localhost:8080/api/search/byTitle?title=${title}`)
        .then((response) => {
            if(response)
            setBookList(response.data);
        })
        .catch((error)=>{
            console.error("searchError:",error);
        })
    };

    return(
        <div className={styles.field}>
            <InputForm
                title="タイトル検索"
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