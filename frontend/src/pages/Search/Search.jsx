import React from "react";
import { Routes, Route } from 'react-router-dom'
import SearchByTitle from "./SearchByTitle"

const Search = () =>{
    return (
        <div>
            <Routes>
                <Route path="byTitle" element={<SearchByTitle/>}/>
            </Routes>

        </div>
    );
};

export default Search;