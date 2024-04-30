import React, {FC}  from "react";

interface BookProps  {
    id: number;
    name: string;
    author: string;
    publisher: string;
    created_at: number;
    isbn: number;
}

interface BookListProps {
    body:BookProps[];
}

export const BookList: FC<BookListProps> = ({body}) => {
    return(
        <div></div>
    );
}