import React from 'react'
import styles from './NormalButton.module.css'

type Props = {
    type: "submit"|"reset" | "button" | undefined,
    label: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NormalButton: React.FC<Props> = ({type, label, onClick}) => {
    return(
        <button type={type} onClick={onClick} className={styles.normalButton}>{label}</button>
    )
}