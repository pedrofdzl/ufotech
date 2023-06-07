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
  getLists: async () => {},
  createList: async () => {},
  updateList: async () => {},
  deleteList: async () => {},
  addProduct: async () => {},
  editProduct: async () => {},
  joinList: async () => {},
  fetchList: async () => {},
};

export const ListContext = React.createContext(defaultListContext);

export const ListProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const { userInformation } = useContext(UserInformationContext);
  const { categories } = useContext(ProductContext);
  const { queueNotification } = useContext(NotificationContext);

  const [lists, setLists] = useState(defaultListContext.lists);

  const getLists = async () => {
    const listCollection = collection(db, 'Listas');
    const listasQuery = query(listCollection);
    const fetchedLists = await getDocs(listasQuery);
    let auxLists = {};

    if (fetchedLists.size > 0 && userInformation.email !== null) {
      fetchedLists.forEach((doc) => {
        const data = doc.data();
        if (data.Owner === userInformation.email || data?.Collaborators?.find((email) => email === userInformation.email)) {
          let total = 0;
          Object.keys(data.Products).forEach((prod) => {
            const auxProduct = data.Products[prod];
            const price = categories?.categories[
              auxProduct.category
            ].products.find(
              (product) => product.id === auxProduct.product
            ).Precio;
            total += parseFloat(price) * data.Products[prod].quantity;
          });
          auxLists[doc.id] = {
            name: data.Nombre,
            owner: data.Owner,
            createdDate: data.CreatedDate.toDate(),
            products: data.Products,
            type: data?.Collaborators ? 'shared' : 'private',
            total: total,
          };
        }
      });
    } else {
      setLists({ myLists: {}, isLoading: false });
      return;
    }
    setLists({ myLists: auxLists, isLoading: false });
  };

  const resetMyLists = async () => {
    console.log('Reseting Lists...');
    setLists({
      myLists: {},
      isLoading: false,
    });
    getLists();
  };

  const createList = async ({ name, owner, success }) => {
    const listasCollection = collection(db, 'Listas');
    const date = new Date();
    addDoc(listasCollection, {
      Nombre: name,
      Owner: owner,
      CreatedDate: date,
      LastUpdate: date,
      Products: {},
    }).then((lista) => {
      queueNotification({
        message: 'Lista creada exitosamente',
        type: 'success',
      });
      success();
    });
  };

  const updateList = async ({ list, name, success }) => {
    const listReference = doc(db, 'Listas', list);
    const date = new Date();
    updateDoc(listReference, {
      Nombre: name,
      LastUpdate: date,
    }).then(() => {
      queueNotification({
        message: 'Lista actualizada exitosamente',
        type: 'success',
      });
      success();
    });
  };

  const deleteList = async ({ list, success }) => {
    const listReference = doc(db, 'Listas', list);
    deleteDoc(listReference).then(() => {
      queueNotification({
        message: 'Lista eliminada exitosamente',
        type: 'success-variant',
      });
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
        addedBy: userInformation.email,
      };

      auxProducts[product] = auxProduct;

      const date = new Date();

      updateDoc(listRef, {
        LastUpdate: date,
        Products: auxProducts,
      }).then(() => {
        queueNotification({
          message: 'Artículo agregado exitosamente',
          type: 'success',
        });
        getLists();
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
        queueNotification({
          message: 'Artículo modificado exitosamente',
          type: 'success',
        });
        getLists();
        success();
      });
    }
  };

  const fetchList = async (listID) => {
    if (listID) {
      const listRef = doc(db, 'Listas', listID);
      const listSnap = await getDoc(listRef);
      const listData = listSnap.data();

      return listData?.Nombre;
    }
  };

  const joinList = async ({ list, userEmail, success }) => {
    const listRef = doc(db, 'Listas', list);
    const listSnap = await getDoc(listRef);
    const listData = listSnap.data();

    if (!listData?.Collaborators) {
      listData.Collaborators = [];
    }

    if (listData?.Owner !== userEmail && !(listData?.Collaborators?.find((user) => user === userEmail))) {
      listData.Collaborators.push(userEmail);
      updateDoc(listRef, listData).then(() => {
        queueNotification({
          message: 'Te has unido con éxito',
          type: 'success',
        });
        getLists();
        success();
      });
    } else {
      queueNotification({
        message: 'Ya participas en esta lista',
        type: 'warning',
      });
      success();
    }

  };

  useEffect(() => {
    setLists({ ...defaultListContext.lists });
    getLists();
  }, [userInformation]);

  return (
    <ListContext.Provider
      value={{
        lists,
        getLists,
        createList,
        updateList,
        deleteList,
        addProduct,
        editProduct,
        joinList,
        fetchList,
      }}>
      {authState.isLoading || lists.isLoading ? <Loading /> : children}
    </ListContext.Provider>
  );
};
