import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
const Home = () => {
    return (
        <div>
            <div className = {styles.Title}>
                <h1>home</h1>
            </div>
            <div>
                <Link to="/add">蔵書追加はこちら</Link>
            </div>
        </div>
    )
}

export default Home;