import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Mypage.module.css'
import { BackButton } from '../../components'
import { BookList } from '../../components'
const Mypage = () => {
    const [username, setUsername] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [userID, setUserID] = useState('');
    const [error, setError] = useState('');
    const [borrowerBooks, setBorrowedBooks] = useState([]);

    const fetchUser = async() => {
        try{
            const token = localStorage.getItem('token');
            if(token){
                const response = await axios.get("http://localhost:8080/api/user",{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setUsername(response.data.username);
                setUserID(response.data.id)
                setIconURL(response.data.iconURL);
                console.log(response.data)
            }

        } catch (err) {
            setError('情報取得失敗')
        }
    }

    const fetchBorrowedBooks = async () => {
        const loanEndpoint = `http://localhost:8080/api/currentloans?userID=${userID}`;
        const loanResponse = await axios.get(loanEndpoint);
        setBorrowedBooks(loanResponse.data)

        console.log("result:",borrowerBooks);
    }

    useEffect(() => {
        fetchUser();
    },[])

    useEffect(() => {
        if(userID){
            fetchBorrowedBooks();
        }
    },[userID])

    return(
        <div>
            <BackButton/>
            <h2>{username}のマイページ</h2>
            <img src={iconURL} alt='User Icon' className={styles.icon}/>
            <BookList  bookList={borrowerBooks}/>
        </div>
    )
}

export default Mypage;