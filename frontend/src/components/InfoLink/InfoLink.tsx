import React from "react"

type Props = {
    title: string;
    to: string;
}

export const InfoLink: React.FC<Props> = ({title,to}) =>{
    return(
        <div>
            <h1>仮</h1>
            <h1>{title}</h1>
            <p>{to}</p>
        </div>
    );

}