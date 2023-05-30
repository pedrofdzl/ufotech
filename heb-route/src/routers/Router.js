import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Auth Routes
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

// Index route view
import Index from '../views/Index';

// Public views
import Auth from '../views/Auth';
import Login from '../views/Login';
import Register from '../views/Register';

// Navigators

// Private views
import BottomNavigation from '../navigators/BottomNavigation';

import Category from '../views/Category';
import Product from '../views/Product';
import Search from '../views/Search';
import List from '../views/List';
import Support from '../views/Support';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Index/>}/>

        <Route exact path="/auth" element={<PublicRoute><Auth/></PublicRoute>}/>
        <Route exact path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route exact path="/register" element={<PublicRoute><Register/></PublicRoute>}/>

        <Route exact path="/dashboard" element={<PrivateRoute><BottomNavigation/></PrivateRoute>}/>
        <Route exact path="/categories/:categoryID" element={<PrivateRoute><Category/></PrivateRoute>}  />
        <Route exact path='/products/:categoryID/:productID' element={<PrivateRoute><Product/></PrivateRoute>} />
        <Route exact path='/lists/:listID' element={<PrivateRoute><List/></PrivateRoute>} />

        <Route exact path="/support" element={<PrivateRoute><Support/></PrivateRoute>} />
        <Route exact path='/search' element={<PrivateRoute><Search/></PrivateRoute> } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;