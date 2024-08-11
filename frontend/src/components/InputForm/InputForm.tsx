import React from "react";
import styles from "./InputForm.module.css"

type Props = {
    title: string;
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
    title,
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
            <h1>{title}</h1>
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
                <button
                    className={styles.submitButton}
                    type="submit"
                >
                    {buttonText}
                </button>
            </form>
        </div>
    )
}