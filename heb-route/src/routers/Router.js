import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers
import { AuthContext } from '../providers/AuthProvider';

// Public views
import Auth from '../views/Auth';
import Login from '../views/Login';
import Register from '../views/Register';

// Private views
import Dashboard from '../views/Dashboard';

const PublicRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Auth/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
};

const AppRouter = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
    {console.log(isAuthenticated)}
    {isAuthenticated ? <PrivateRouter/> : <PublicRouter/>}
    </>
  );
};

export default AppRouter;