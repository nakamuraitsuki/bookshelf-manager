import './App.css';
import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Add from './pages/Add/Add';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path = "/add" element={<Add/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
