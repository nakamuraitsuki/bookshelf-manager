import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './Book.module.css'

const Book = () => {
    /*slugは本のidにする予定*/
    const { id } = useParams();
    const [bookInfo,setBookInfo] = useState(null);

    
    useEffect(() => {
        const endpoint = `http://localhost:8080/api/books/${id}`
        axios.get(endpoint).then((response) => {
            setBookInfo(response.data);
        })
        .catch(error =>{
            console.error("Error:",error);
        });
        
    },[]);
    
    if(bookInfo == null){
        return (
            <div>
                <h1>NOT  FOUND</h1>
            </div>
        );
    }

    return (
        <div>
            <p>『{bookInfo.title}』の詳細ページ</p>
        </div>
    );
};

export default Book;