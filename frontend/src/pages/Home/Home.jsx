import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { FaBookMedical } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Home = () => {
    return (
        <div>
            <h1 className={styles.Title}>home</h1>
            <div className={styles.cardField}>
                <Link to="/add" className={`${styles.card} ${styles.addBook}`}>
                    <FaBookMedical className={styles.cardIcon}/>
                    <span className={styles.cardText}>Add Book</span>
                </Link>
                <Link to="/search/byTitle" className={`${styles.card} ${styles.searchBook}`}>
                    <FaSearch className={styles.cardIcon}/>
                    <span className={styles.cardText}>Search Book</span>
                </Link>
            </div>
        </div>
    )
}

export default Home;