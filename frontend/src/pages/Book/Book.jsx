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
    
    return (
        <div>
            {bookInfo ? <p>『{bookInfo.title}』の詳細ページ</p>: <p>ふええ…見つからないよぉ</p>}
        </div>
    );
};

export default Book;