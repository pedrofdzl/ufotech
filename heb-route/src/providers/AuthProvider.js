import React, { useEffect, useState } from 'react';

// Firebase
import "firebase/compat/auth";
import 'firebase/compat/firestore';
import { app } from "../firebase/firebase";

// Views
import Loading from '../views/Loading';

// Auth
import { register } from '../functions/auth';

const defaultAuthContext = {
  currentUser: null,
  authState: {
    user: null,
    isLoading: true,
    isLoggedIn: false,
  },
  providerRegister: async () => {},
  providerLogin: async () => {},
  providerLogout: async () => {},
};

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(defaultAuthContext.authState);
  const [currentUser, setCurrentUser] = useState(null);
  
  const providerRegister = async (name, lastname, email, password, repPassword) => {
    register(name, lastname, email, password, repPassword);
  };

  const providerLogin = async (email, password) => {
    app.auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
        console.log("Usuario Iniciado:", user.user);
    }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
    });
  };

  const providerLogout = async () => {
    app.auth()
      .signOut()
      .then(() => {
        setAuthState({
          ...defaultAuthContext.authState,
          isLoading: false,
        });
        return true;
      })
      .catch((error) => {
        return false;
      });
  };

  useEffect(() => {
    const updateAuthState = async (user) => {
      try {
        setAuthState((current) => ({
          ...current,
          isLoggedIn: true,
          isLoading: false,
          user: user,
        }));
      } catch (error) {
        providerLogout();
      }
    };

    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user?.uid) {
        updateAuthState(user);
      } else {
        setAuthState({ ...defaultAuthContext.authState, isLoading: false });
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        currentUser,
        providerRegister,
        providerLogin,
        providerLogout,
      }}>
      {authState.isLoading ? (
        <Loading/>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};