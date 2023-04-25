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
import BottomNavigation from '../navigators/BottomNavigation';

// Private views
import Categories from '../views/Categories';
import CategoryProducts from '../views/CategoryProducts';
import Products from '../views/Products';
import Product from '../views/Product';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Index/>}/>

        <Route exact path="/auth" element={<PublicRoute><Auth/></PublicRoute>}/>
        <Route exact path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route exact path="/register" element={<PublicRoute><Register/></PublicRoute>}/>

        <Route exact path="/dashboard" element={<PrivateRoute><BottomNavigation/></PrivateRoute>}/>

        {/* <Route exact path="/" element={<Dashboard/>}/>
        <Route exact path="/categories" element={<Categories/>} />
        <Route exact path="/categories/:category" element={<CategoryProducts/>}  />
        <Route exact path='/product/:id' element={<Product/>} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;