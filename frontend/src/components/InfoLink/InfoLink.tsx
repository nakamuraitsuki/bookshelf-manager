import React from "react"
import { Link } from 'react-router-dom'
import styles from './InfoLink.module.css';

type Props = {
    book:{
        id: number;
        title: string
        author: string;
        publisher: string;
        isbn: string;
        quantity: number;
        available_quantity: number;
        created_at: Date;
    }
    to: number;
}

export const InfoLink: React.FC<Props> = ({book,to}) =>{
    return(
        <div>
            <Link to={`/book/${to}`} className={styles.card}>
                <span className={styles.title}>{book.title} / {book.author} / {book.publisher}</span>
            </Link>
        </div>
    );

}