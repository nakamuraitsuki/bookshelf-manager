import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './Book.module.css'
import { useAuth } from '../../components'

const Book = () => {
    /*slugは本のidにする予定*/
    const { id } = useParams();
    const [userID, setUserID] = useState(null);
    const [bookInfo,setBookInfo] = useState(null);
    const [loanStatus, setLoanStatus] = useState(null);
    const { isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    /* 書籍情報 */
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const response = await axios.get("http://localhost:8080/api/user",{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserID(response.data.id)
                console.log(userID)
            } else{
                console.log("ログアウト状態")
            }
        } catch (err) {
            setError('情報取得失敗')
        }
    };

    const fetchBookInfo = async () => {
        try {
            const endpoint = `http://localhost:8080/api/books/${id}`;
            const response = await axios.get(endpoint);
            setBookInfo(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchLoanStatus = async () => {
        if (isAuthenticated) {
            try {
                const loanEndpoint = `http://localhost:8080/api/currentloans?userID=${userID}&bookID=${id}`; 
                const response = await axios.get(loanEndpoint);
                setLoanStatus(response.data); // 貸出情報を取得
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setLoanStatus(null); // 貸出中でない場合
                } else {
                    console.error("Error:", error);
                }
            }
        }
    };

    useEffect(() => {
        // ユーザーIDを取得する関数を実行
        fetchBookInfo();
        fetchUserData();
    }, []);
    
    useEffect(() => {
        // userID が取得された後にのみ貸出状況を取得する関数を実行
        if (userID) {
            fetchLoanStatus();
        }
    }, [userID, id, isAuthenticated]);
    
    
        if (bookInfo == null) {
            return (
                <div>
                    <h1>NOT FOUND</h1>
                </div>
            );
        }
    
        const handleBorrow = async () => {
            try {
                await axios.post('http://localhost:8080/api/borrow', {
                    user_id: userID,
                    book_id: bookInfo.id,
                });
                setLoanStatus({ bookId: bookInfo.id, userID }); 
            } catch (error) {
                console.error("Failed to borrow the book:", error);
            }
        };
    
        const handleReturn = async () => {
            try {
                await axios.post('http://localhost:8080/api/return', {
                    user_id: userID,
                    book_id: bookInfo.id,
                });
                setLoanStatus(null); 
            } catch (error) {
                console.error("Failed to return the book:", error);
            }
        };
    
        return (
            <div>
                <p>『{bookInfo.title}』の詳細ページ</p>
                {isAuthenticated && (
                    <div>
                        {loanStatus ? (
                            <button onClick={handleReturn}>返却</button>
                        ) : (
                            <button onClick={handleBorrow}>貸出</button>
                        )}
                    </div>
                )}
            </div>
        );
    };
    
    export default Book;
    