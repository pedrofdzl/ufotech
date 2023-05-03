import React, { useContext, useEffect, useState } from 'react';

// Database
import { db } from '../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

// Views
import Loading from '../views/Loading';

// Providers
import { AuthContext } from "../providers/AuthProvider";

const defaultUserInformationContext = {
  userInformation: {
    firstname: null,
    lastname: null,
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
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInformation((current) => ({
          ...current,
          firstName: docSnap.data().name,
          lastName: docSnap.data().lastname,
          email: docSnap.data().email,
          isLoading: false,
        }));
      } else {
        setUserInformation((current) => ({
          ...current,
          isLoading: false,
        }));
      }
    }
  }

  useEffect(() => {
    console.log('Fetching user data...');
    getUserInformation();
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