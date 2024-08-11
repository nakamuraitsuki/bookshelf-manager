import './App.css';
import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Add from './pages/Add/Add';
import Book from './pages/Book/Book';
import SearchByTitle from './pages/Search/SearchByTitle';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path = "/add" element={<Add/>}/>
          <Route path = "/book/:id" element={<Book/>}/>
          <Route path = "/search/byTitle" element={<SearchByTitle/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
