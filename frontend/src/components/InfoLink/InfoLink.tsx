import React from "react"
import { Link } from 'react-router-dom'

type Props = {
    title: string;
    to: number;
}

export const InfoLink: React.FC<Props> = ({title,to}) =>{
    return(
        <div>
            <Link to={`/book/${to}`}>
                {title}
            </Link>
        </div>
    );

}