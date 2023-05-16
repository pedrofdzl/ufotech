import React, { useContext, useState, useEffect } from 'react';

// Database
import { db } from '../firebase/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

import Loading from '../views/Loading';

import { AuthContext } from '../providers/AuthProvider';
import { UserInformationContext } from '../providers/UserInformationProvider';

const defaultListContext = {
  lists: {
    myLists: {},
    isLoading: true,
  },
  getMyLists: async () => {},
  resetMyLists: async () => {},
};

export const ListContext = React.createContext(defaultListContext);

export const ListProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const { userInformation } = useContext(UserInformationContext);
  const [lists, setLists] = useState(defaultListContext.lists);

  const getMyLists = async () => {
    console.log('Fetching lists...');
    const listCollection = collection(db, 'Listas');
    const listasQuery = query(
      listCollection,
      where('Owner', '==', userInformation.email)
    );
    const fetchedLists = await getDocs(listasQuery);

    if (fetchedLists.size > 0) {
      fetchedLists.forEach((doc) => {
        const data = doc.data();

        let auxLists = lists?.myLists;
        auxLists[doc.id] = {
          name: data.Nombre,
          owner: data.Owner,
          createdDate: data.CreatedDate.toDate(),
          total: data.Total,
          itemCount: data.ItemCount,
        };
        setLists({ myLists: auxLists, isLoading: false });
      });
    } else {
      setLists({ myLists: {}, isLoading: false });
    }
  };

  const resetMyLists = async () => {
    console.log('Reseting Lists...');
    setLists({
      myLists: {},
      isLoading: false,
    });
    getMyLists();
  };

  useEffect(() => {
    getMyLists();
  }, [authState]);

  return (
    <ListContext.Provider
      value={{
        lists,
        getMyLists,
        resetMyLists,
      }}>
      {authState.isLoading || lists.isLoading ? <Loading /> : children}
    </ListContext.Provider>
  );
};
