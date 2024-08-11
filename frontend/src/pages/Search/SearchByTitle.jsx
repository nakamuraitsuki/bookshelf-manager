import React from "react";
import { useState,useEffect } from "react";
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
            <h1>タイトル検索</h1>
            <form onSubmit={catchBookList}>
                <label className={styles.inputLabel}>検索</label>
                <input
                    className={styles.inputBox}
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="タイトル"
                />
                <button
                    className={styles.submitButton} 
                    type="submit"
                >
                    検索
                </button>
            </form>
            <BookList listTitle="検索結果" bookList={bookList}/>
        </div>
    );
};

export default SearchByTitle;