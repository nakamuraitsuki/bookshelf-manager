import React from "react";
import styles from "./SearchSwitch.module.css"
import { Link } from "react-router-dom";
import { FaCheck} from "react-icons/fa";

type Props = {
    left: string;
    right: string;
    to: string;
    switched?: boolean;/*左選択中ならfalse*/
    
}

export const SearchSwitch: React.FC<Props> = ({
    left,
    right,
    to,
    switched=false,
}) =>{
    return (
        <div className={styles.Conteiner}>
            { switched ? 
                (
                    <div className={styles.switch}>
                        <div className={styles.selectedLeft}>
                            <FaCheck/>{left}
                        </div>
                        <Link to={to} className={styles.nonSelectedRight}>
                            {right}
                        </Link>
                    </div>

                ):(
                    <div className={styles.switch}>
                        <Link to={to} className={styles.nonSelectedLeft}>
                            {left}
                        </Link>
                        <div className={styles.selectedRight}>
                            <FaCheck/>{right}
                        </div>
                    </div>
                )
            }
        </div>
    );
}