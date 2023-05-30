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
<<<<<<< HEAD
import ListRoute from '../views/ListRoute';

// Error View
import Error404 from '../views/404';
import TestError from '../views/TestError';
import RoutingErrorBoundary from '../errorhandling/RoutingErrorBoundary';
=======
import Support from '../views/Support';
>>>>>>> b72fef6 (se hizo la pantalla de support)

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Index/>}/>

        <Route exact path="/auth" element={<PublicRoute><Auth/></PublicRoute>}/>
        <Route exact path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route exact path="/register" element={<PublicRoute><Register/></PublicRoute>}/>

        <Route exact path="/dashboard" element={<PrivateRoute><BottomNavigation/></PrivateRoute>}/>
        <Route exact path="/categories/:categoryID" element={<PrivateRoute><RoutingErrorBoundary><Category/></RoutingErrorBoundary></PrivateRoute>}  />
        <Route exact path='/products/:categoryID/:productID' element={<PrivateRoute><RoutingErrorBoundary><Product/></RoutingErrorBoundary></PrivateRoute>} />
        <Route exact path='/lists/:listID' element={<PrivateRoute><RoutingErrorBoundary><List/></RoutingErrorBoundary></PrivateRoute>} />
        <Route exact path='/route/:listID' element={<PrivateRoute><RoutingErrorBoundary><ListRoute/></RoutingErrorBoundary></PrivateRoute>} />

        <Route exact path="/support" element={<PrivateRoute><Support/></PrivateRoute>} />
        <Route exact path='/search' element={<PrivateRoute><Search/></PrivateRoute> } />
        <Route path='*' element={<Error404/>} />

        {/* <Route exact path='/testerror' element={<TestError hasError />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;