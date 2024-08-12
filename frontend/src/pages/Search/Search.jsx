import React from "react";
import { Routes, Route } from 'react-router-dom'
import SearchByTitle from "./SearchByTitle"
import SearchByAuthor from "./SearchByAuthor";
import { BackButton } from "../../components";

const Search = () =>{
    return (
        <div>
            <BackButton/>
            <Routes>
                <Route path="byTitle" element={<SearchByTitle/>}/>
                <Route path="byAuthor" element={<SearchByAuthor/>}/>
            </Routes>

        </div>
    );
};

export default Search;