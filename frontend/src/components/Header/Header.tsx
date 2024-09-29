import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthProvider/AuthProvider'
import { Link } from 'react-router-dom';
import styles from "./Header.module.css"
import axios from 'axios';

export const Header: React.FC = () => {
    const {isAuthenticated, logout} = useAuth();
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const response = await axios.get("http://localhost:8080/api/user",{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
            } else{
                console.log("ログアウト状態")
            }
        } catch (err) {
            setError('情報取得失敗')
        }
    };

    useEffect(() => {
        if(isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);


    return(
        <header>
            <p className={styles.title}>蔵書管理システム</p>
            <div className={styles.userCard}>
                {isAuthenticated ? (
                    <div className={styles.userCard}>
                        <Link to={'/mypage'} className={styles.card}>
                            <span className={styles.text}>{username}</span>
                        </Link>

                        <div className={styles.card} onClick={logout}>
                            <span className={styles.text}>Logout</span>
                        </div>
                    </div>
                ):(
                    <Link to={'/login'} className={styles.card} >
                        <span className={styles.text}>Login</span>
                    </Link>
                )}
            </div>
        </header>
    )
}