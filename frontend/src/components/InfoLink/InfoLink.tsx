import React from "react"
import { Link } from 'react-router-dom'
import styles from './InfoLink.module.css';

type Props = {
    title: string;
    to: number;
}

export const InfoLink: React.FC<Props> = ({title,to}) =>{
    return(
        <div>
            <Link to={`/book/${to}`} className={styles.card}>
                <span className={styles.title}>{title}</span>
            </Link>
        </div>
    );

}