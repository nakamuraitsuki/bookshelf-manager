import React from "react";
import { Routes, Route } from 'react-router-dom'
import SearchByTitle from "./SearchByTitle"
import SearchByAuthor from "./SearchByAuthor";

const Search = () =>{
    return (
        <div>
            <Routes>
                <Route path="byTitle" element={<SearchByTitle/>}/>
                <Route path="byAuthor" element={<SearchByAuthor/>}/>
            </Routes>

        </div>
    );
};

export default Search;