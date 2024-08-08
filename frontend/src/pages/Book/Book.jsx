import React, { useState } from 'react'
import { UseParams } from 'react-router-dom'
import axios from 'axios'
import styles from './Book.module.css'

const Books = () => {

    const { slug } = useParams();
    const [bookInfo,setBookInfo] = useState(null);

    const endpoint = `http://localhost:8080/api/books/:${slug}`
    
}