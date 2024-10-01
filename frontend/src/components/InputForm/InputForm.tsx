import React from "react";
import { NormalButton } from "../NormalButton/NormalButton";
import styles from "./InputForm.module.css"

type Props = {
    placeholder: string;
    buttonText: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    inputLabel: string;
    id: string;
    type: string;
    maxLength: number;
    minLength: number;
    required?: boolean;
}

export const InputForm: React.FC<Props> = ({
    placeholder,
    buttonText,
    onSubmit,
    inputLabel,
    id,
    type,
    maxLength,
    minLength,
    required = true
}) => {
    return (
        <div className={styles.field}>
            <form onSubmit={onSubmit}>
                <label className={styles.inputLavel}>{inputLabel}</label>
                <input
                    className={styles.inputBox}
                    id={id}
                    name={id}
                    type={type}
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    placeholder={placeholder}
                />
                <NormalButton type="submit" label={buttonText}/>
            </form>
        </div>
    )
}