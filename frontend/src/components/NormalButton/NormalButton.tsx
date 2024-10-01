import React from 'react'
import styles from './NormalButton.module.css'

type Props = {
    label: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NormalButton: React.FC<Props> = ({label, onClick}) => {
    return(
        <button type='button' onClick={onClick} className={styles.normalButton}>{label}</button>
    )
}