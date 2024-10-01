import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { NormalButton, useAuth } from '../../components';
import styles from "./Login.module.css"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8080/api/login", {username, password });
            console.log("データ送った！返答これ")
            console.log(response.data)

            const token = response.data.token;

            /*jwtをローカルストレージにぶち込む*/
            if(token){
                console.log("トークンぶち込んだ！")
                login(token);
                navigate('/mypage');
            }else{
                setError('トークン取得失敗')
            }

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'ログイン失敗');
            } else {
                setError('ログイン失敗');
                console.log(err);
            }
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
                <NormalButton type='submit' label='ろぐいん' />
            </form>
            <Link to='/register'>ユーザー登録はこちら</Link>
        </div>
    );
};

export default Login;