import React, { useContext, useState, useEffect } from 'react';

// Database
import { db } from '../firebase/firebase';
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';

import Loading from '../views/Loading';

// Providers
import { AuthContext } from '../providers/AuthProvider';
import { UserInformationContext } from '../providers/UserInformationProvider';
import { ProductContext } from './ProductProvider';
import { NotificationContext } from './NotificationProvider';

const defaultListContext = {
  lists: {
    myLists: {},
    isLoading: true,
  },
  getMyLists: async () => {},
  resetMyLists: async () => {},
  createList: async () => {},
  updateList: async () => {},
  deleteList: async () => {},
  addProduct: async () => {},
  editProduct: async () => {},
};

export const ListContext = React.createContext(defaultListContext);

export const ListProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const { userInformation } = useContext(UserInformationContext);
  const { categories } = useContext(ProductContext);
  const { queueNotification } = useContext(NotificationContext);

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
        let total = 0;
        Object.keys(data.Products).forEach((prod) => {
          const auxProduct = data.Products[prod];
          const price = categories?.categories[auxProduct.category].products.find(
            (product) => product.id === auxProduct.product).Precio;
          total += parseFloat(price) * data.Products[prod].quantity;
        });
        let auxLists = lists?.myLists;
        auxLists[doc.id] = {
          name: data.Nombre,
          owner: data.Owner,
          createdDate: data.CreatedDate.toDate(),
          products: data.Products,
          total: total,
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

  const createList = async ({ name, owner, success }) => {
    const listasCollection = collection(db, 'Listas');
    const date = new Date();
    addDoc(listasCollection, {
      Nombre: name,
      Owner: owner,
      CreatedDate: date,
      Products: {},
    }).then((lista) => {
      queueNotification({ message: 'Lista creada existosamente!', type: 'success' });
      success();
    });
  };

  const updateList = async ({ list, name, success }) => {
    const listReference = doc(db, 'Listas', list);
    updateDoc(listReference, {
      Nombre: name,
    }).then(() => {
      queueNotification({ message: 'Lista actualizada existosamente!', type: 'success' });
      success();
    });
  };

  const deleteList = async ({ list, success }) => {
    const listReference = doc(db, 'Listas', list);
    deleteDoc(listReference).then(() => {
      queueNotification({ message: 'Lista eliminada existosamente!', type: 'success-variant' });
      success();
    });
  };

  const addProduct = async ({ list, category, product, quantity, success }) => {
    if (list) {
      const listRef = doc(db, 'Listas', list);
      const listSnap = await getDoc(listRef);
      const listData = listSnap.data();

      const auxProducts = listData?.Products;

      const auxProduct = {
        product: product,
        category: category,
        quantity: (auxProducts[product]?.quantity || 0) + quantity,
      };

      auxProducts[product] = auxProduct;

      updateDoc(listRef, {
        Products: auxProducts,
      }).then(() => {
        queueNotification({ message: 'Artículo agregado existosamente!', type: 'success' });
        getMyLists();
        success();
      });
    }
  };

  const editProduct = async ({ list, product, quantity, success }) => {
    if (list) {
      const listRef = doc(db, 'Listas', list);
      const listSnap = await getDoc(listRef);
      const listData = listSnap.data();

      const auxProducts = listData?.Products;

      const auxProduct = {
        ...auxProducts[product],
        quantity: quantity,
      };

      auxProducts[product] = auxProduct;

      if (quantity <= 0) {
        delete auxProducts[product];
      }

      updateDoc(listRef, {
        Products: auxProducts,
      }).then(() => {
        queueNotification({ message: 'Artículo modificado existosamente!', type: 'success' });
        getMyLists();
        success();
      });
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
        resetMyLists,
        createList,
        updateList,
        deleteList,
        addProduct,
        editProduct,
      }}>
      {authState.isLoading || lists.isLoading ? <Loading /> : children}
    </ListContext.Provider>
  );
};
