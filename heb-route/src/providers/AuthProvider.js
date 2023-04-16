import React, { useEffect, useState } from 'react';
import { app } from "../firebase/firebase";

// Views
import Loading from '../views/Loading';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  useEffect(() => {
    setIsAuthenticated(currentUser ? true : false);
  }, [currentUser]);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsLoading(false);
    }
  }, [isAuthenticated]); 

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setCurrentUser,
      }}
    >
      {isLoading ? <Loading/> : children}
    </AuthContext.Provider>
  );
};