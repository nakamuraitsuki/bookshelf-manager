import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { BackButton, NormalButton, useAuth } from '../../components'


const Book = () => {
    /*slugは本のidにする予定*/
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [bookInfo,setBookInfo] = useState(null);
    const [loanStatus, setLoanStatus] = useState(null);
    const { isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    
    /* ユーザー情報get*/
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const response = await axios.get("http://localhost:8080/api/user",{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data)
                console.log("Userdata",user)
            } else{
                console.log("ログアウト状態")
            }
        } catch (err) {
            setError('情報取得失敗')
        }
    };

    /*書籍情報get*/
    const fetchBookInfo = async () => {
        try {
            const endpoint = `http://localhost:8080/api/books/${id}`;
            const response = await axios.get(endpoint);
            setBookInfo(response.data);
            console.log("BookData",bookInfo);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchLoanStatus = async () => {
        if(isAuthenticated) {
            try {
                const loanEndpoint = `http://localhost:8080/api/loans?bookID=${bookInfo.id}`
                const response = await axios.get(loanEndpoint);
                console.log("このリクエストを送った", loanEndpoint)

                const loanData = response.data;
                console.log("レスポンスはこれ",loanData)
                console.log("比較するゆーざーIDはこれ",user.id)
                const isUserBorrowed = loanData.some(loan => loan.UserID === user.id)

                if(isUserBorrowed){
                    setLoanStatus(true);
                    console.log("借りてるよ")
                } else {
                    setLoanStatus(null);
                    console.log("借りてないよ")
                }
            }   catch (error) {
                console.error("貸出情報取得エラー", error);
                setLoanStatus(null);
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
        if (user && bookInfo) {
            fetchLoanStatus();
        }
    }, [user, id, isAuthenticated]);

    useEffect(() => {
        fetchBookInfo();
    },[loanStatus]);
    
    

    
    const handleBorrow = async () => {
        try {
            await axios.post('http://localhost:8080/api/borrow', {
                user_id: user.id,
                book_id: bookInfo.id,
            });
            setLoanStatus({ bookId: bookInfo.id, userId:user.id });             
        } catch (error) {
            console.error("Failed to borrow the book:", error);
        }
    };
    
    const handleReturn = async () => {
        try {
            await axios.post('http://localhost:8080/api/return', {
                user_id: user.id,
                book_id: bookInfo.id,
            });                
            setLoanStatus(null); 
        } catch (error) {
            console.error("Failed to return the book:", error);
        }
    };

    if (bookInfo == null) {
        return (
            <div>
                <h1>NOT FOUND</h1>
            </div>
            );
    }
    return (
        <div>
            <BackButton/>
            <p>『{bookInfo.title}』の詳細ページ</p>
            {isAuthenticated ? (
                <div>
                    {bookInfo.available_quantity === 0 ? (
                        loanStatus ? (
                            <div>
                                <NormalButton type='button' label='返却' onClick={handleReturn}/>
                                <p>すべて借りられています</p>
                            </div>
                        ) : (
                            <p>すべて借りられています。</p>
                        )
                    ) : (
                        <div>
                            {loanStatus ? (
                                <NormalButton type='button' label='返却' onClick={handleReturn}/>
                            ) : (
                                <NormalButton type='button' label='貸出' onClick={handleBorrow}/>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>本を借りるにはログインする必要があります。</p>
            )}
        </div>
    );
};
    
    export default Book;
    