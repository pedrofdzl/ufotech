import React, { useContext, useEffect, useState } from 'react';

// Database
import { db } from '../firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

// Views
import Loading from '../views/Loading';

// Providers
import { AuthContext } from "../providers/AuthProvider";

const defaultUserInformationContext = {
  userInformation: {
    firstName: null,
    lastName: null,
    email: null,
    isLoading: true,
  },
  getUserInformation: async () => {},
};

export const UserInformationContext = React.createContext();

export const UserInformationProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);

  const [userInformation, setUserInformation] = useState(defaultUserInformationContext.userInformation);
  
  const getUserInformation = async () => {
    if (authState.user?.email){
      const docRef = doc(db, "users", authState.user.email);

      const untilFound = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserInformation((current) => ({
          ...current,
          firstName: docSnap.data().name,
          lastName: docSnap.data().lastname,
          email: docSnap.data().email,
          profilepic:  (docSnap.data().profilepic !== undefined) ? docSnap.data().profilepic : '',
          isLoading: false,
        }));
        untilFound(); // Stop listening for changes
      } else {
        console.log("¡No se encontró el usuario!");
        setUserInformation((current) => ({
          ...current,
          isLoading: false,
        }));
      }
    });
    } else {
      setUserInformation({
        ...defaultUserInformationContext.userInformation
      });
    }
  }

  useEffect(() => {
    if (authState.isLoggedIn) {
      getUserInformation();
    }
  }, [authState]);

  return (
    <UserInformationContext.Provider
      value={{
        userInformation,
        getUserInformation,
      }}>
      {authState.isLoading && userInformation.isLoading ? (
        <Loading/>
      ) : (
        children
      )}
    </UserInformationContext.Provider>
  );
};