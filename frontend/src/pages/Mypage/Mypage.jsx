import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Mypage.module.css'

const Mypage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [error, setError] = useState('');

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
                setEmail(response.data.email);
                setIconURL(response.data.iconURL);
            }

        } catch (err) {
            setError('情報取得失敗')
        }
    }

    useEffect(() => {
        fetchUser();
    },[])

    return(
        <div>
            <h2>{username}のマイページ</h2>
            <img src={iconURL} alt='User Icon' className={styles.icon}/>
            
        </div>
    )
}

export default Mypage;