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
};

export const ListContext = React.createContext(defaultListContext);

export const ListProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const { userInformation } = useContext(UserInformationContext);
  const [lists, setLists] = useState(defaultListContext.lists);

  const getMyLists = async () => {
    const listCollection = collection(db, 'Listas');
    const listasQuery = query(
      listCollection,
      where('Owner', '==', userInformation.email)
    );
    const fetchedLists = await getDocs(listasQuery);

    if (fetchedLists.size > 0) {
      fetchedLists.forEach((doc) => {
        const data = doc.data();

        if (!lists?.myLists?.[doc.id]) {
          let auxLists = lists;
          auxLists.myLists[doc.id] = {
            name: data.Nombre,
            owner: data.Owner,
            createdDate: data.CreatedDate.toDate(),
          };
          setLists({ ...auxLists, isLoading: false });
        }
      });
    } else {
      setLists({ myLists: {}, isLoading: false });
    }
  };
  useEffect(() => {
    getMyLists();
  }, [authState]);

  return (
    <ListContext.Provider
      value={{
        lists,
        getMyLists,
      }}>
      {authState.isLoading || lists.isLoading ? <Loading /> : children}
    </ListContext.Provider>
  );
};
