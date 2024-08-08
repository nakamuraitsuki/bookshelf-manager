import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './Book.module.css'

const Book = () => {
    /*slugは本のidにする予定*/
    const { id } = useParams();
    const [bookInfo,setBookInfo] = useState(null);
    const endpoint = `http://localhost:8080/api/books/${id}`
    
    useEffect(() => {
        axios.get(endpoint).then((response) => {
            setBookInfo(response.data);
        })
        .catch(error =>{
            console.error("Error:",error);
        });
    },[]);
    
    return (
        <div>
            <h1>つながってるお</h1>
            <h1>{bookInfo.title}</h1>
            <h2>{bookInfo.author}</h2>
        </div>
    );
};

export default Book;