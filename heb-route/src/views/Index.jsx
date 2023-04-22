import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

// Provider
import { AuthContext } from '../providers/AuthProvider';

const Index = () => {
    const { authState, currentUser } = useContext(AuthContext);

    return (
        authState.isLoggedIn === true && currentUser !== null
        ? <Navigate to="/dashboard" replace/>
        : <Navigate to="/auth" replace/>
    )

};

export default Index;