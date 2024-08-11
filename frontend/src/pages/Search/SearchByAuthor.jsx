import React from "react";
import { useState } from "react";
import axios from "axios";
import { BookList, InputForm } from "../../components";


const SearchByAuthor = () =>{
    const [bookList,setBookList] = useState([]);

    const catchBookList = (e) =>{
        e.preventDefault();

        const author = e.target.elements.author.value;

        axios.get(`http://localhost:8080/api/search/byAuthor?author=${author}`)
        .then((response) =>{
            setBookList[response.data];
        })
        .catch((error)=>{
            console.error("getListeError:",error);
        })
    };

    return (
        <div>
            <InputForm
                title="著者検索"
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