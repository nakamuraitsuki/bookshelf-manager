import React,{useState} from 'react'
import axios from 'axios'
import { NormalButton } from '../../components'
import { useNavigate } from 'react-router-dom'
import styles from "./Register.module.css"


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPasswod] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
    
        try{
            const response = await axios.post("http://localhost:8080/api/register", {
                username,
                email,
                password,
            });
            console.log('User registered:', response.data);
            
        } catch (error) {
            console.error('Error registering user:', error);
        }
        navigate('/mypage');
    };

    return (
        <div className={styles.field}>
            <p className={styles.inputLabel}>ユーザー登録</p>
            <form onSubmit = {handleSubmit} className={styles.formField}>
                <input
                    className={styles.inputBox}
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    className={styles.inputBox}
                    type="email"
                    placeholder="メール"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={styles.inputBox}
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPasswod(e.target.value)}
                    required
                />
                <NormalButton type='submit' label='登録'/>
            </form>
        </div>
    );
};

export default Register;