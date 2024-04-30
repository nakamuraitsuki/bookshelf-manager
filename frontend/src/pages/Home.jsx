import React from "react";
import {Link} from "react-router-dom";
import style from "./Home.module.css";

const Home = () => {
    return (
        <div>
            <div className={style.titleContainer}>
                <h1 className={style.title}>埼玉大学推理小説研究会蔵書管理</h1>
            </div>
            <div className={style.linkContainer}>
                <Link to="/add" className={style.link}>蔵書追加はこちら</Link>
            </div>
            <h2 className={style.title}>蔵書検索</h2>
            
        </div>
    );
}

export default Home ;