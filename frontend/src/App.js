import './App.css';
import React from 'react';
import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components';
import Home from './pages/Home/Home';
import Add from './pages/Add/Add';
import Book from './pages/Book/Book';
import Search from './pages/Search/Search';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Mypage from './pages/Mypage/Mypage';
import { Header } from './components';


function App() {

  const PrivateRoute = ({ children }) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
  }

  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path = "/add" element={<Add/>}/>
            <Route path = "/book/:id" element={<Book/>}/>
            <Route path = "/search/*" element={<Search/>}/>
            <Route path = "/register" element={<Register/>}/>
            <Route path = "/login" element={<Login/>}/>
            <Route
              path="mypage"
              element={
                <PrivateRoute>
                  <Mypage/>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
