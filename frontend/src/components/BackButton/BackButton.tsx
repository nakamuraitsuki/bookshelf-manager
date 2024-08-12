import React from "react";
import { Link } from "react-router-dom";
import styles from "./BackButton.module.css"
import { RiArrowGoBackFill } from "react-icons/ri";

export const BackButton = () =>{
    return (
        <Link to="/" className={styles.backField}>
            <RiArrowGoBackFill className={styles.backIcon}/>
        </Link>
    )
};