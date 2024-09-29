import React, { useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router';
import styles from "./Login.module.css"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8080/api/login", {username, password });
            /*jwtをローカルストレージにぶち込む*/
            localStorage.setItem('token', response.data.token);
            /*マイページに飛ばす*/
            navigate('/mypage');
        } catch (err) {
            setError('ログイン失敗');
        }
    };

    return(
        <div className={styles.field}>
            <p className={styles.inputLabel}>ログイン</p>
            <form onSubmit={handleLogin} className={styles.formField}>
                <input
                    className={styles.inputBox}
                    type='text'
                    placeholder='ユーザー名'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    className={styles.inputBox}
                    type='password'
                    placeholder='ぱすわーど'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p>{error}</p>}
                <button type='submit' className={styles.submitButton}>ろぐいん</button>
            </form>

        </div>
    );
};

export default Login;