import React from "react";
import { InfoLink } from "../InfoLink/InfoLink";
import styles from "./BookList.module.css"
type Props = {
    listTitle: string;
    bookList:{
        id: number;
        title: string
        author: string;
        publisher: string;
        isbn: string;
        quantity: number;
        available_quantity: number;
        created_at: Date;
    }[];
}

export const BookList : React.FC<Props> = ({listTitle,bookList}) =>{
    console.log("return 2",bookList);
    if(bookList == null){
        return (
            <div>
                <p>取得失敗</p>
            </div>
        );
    }

    return(
        <div>
            <h2 className={styles.title}>{listTitle}</h2>
            {bookList.map((book)=>(
                <div key={book.id}>
                    <InfoLink book={book} to={book.id}/>
                </div>
            ))}
        </div>
    )
}