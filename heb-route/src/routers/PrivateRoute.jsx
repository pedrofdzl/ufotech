import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

// Provider
import { AuthContext } from '../providers/AuthProvider';

const PrivateRoute = ({ children }) => {
    const { authState, currentUser } = useContext(AuthContext);

    if (authState.isLoggedIn !== true && currentUser === null) {
        return <Navigate to="/auth" replace/>;
    }
    
    return children;
};

export default PrivateRoute;
