import React, { useContext, useEffect, useState } from 'react';

// Database
import { db } from '../firebase/firebase'
import { getDocs, collection } from 'firebase/firestore'

// Views
import Loading from '../views/Loading';

// Providers
import { AuthContext } from "../providers/AuthProvider";

const defaultProductContext = {
  categories: {
    categories: {},
    isLoading: true,
  },
  getCategories: async () => {},
};

export const ProductContext = React.createContext(defaultProductContext);

export const ProductProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const [categories, setCategories] = useState(defaultProductContext.categories);
  
  const getCategories = async () => {
    // Categorias
    const categoryCollection = collection(db, 'Categorias');
    const fetchedCategories = await getDocs(categoryCollection);
    fetchedCategories.forEach(doc => {
      const data = doc.data();

      if (!categories?.categories?.[doc.id]) {
        let auxCategories = categories;
        auxCategories.categories[doc.id] = { name: data.Nombre, emoji: data.Emoji, color: data.Color ? data.Color : '#FFF', products: [] };
        setCategories(auxCategories);
      }
    });

    // Productos
    let auxCategories = categories;
    const productsCollection = collection(db, 'Productos');
    const fetchedProducts = await getDocs(productsCollection);
    fetchedProducts.forEach(doc => {
      let data = doc.data();
      auxCategories?.categories?.[data.Categoria]?.products.push({...data, id: doc.id});
    });
    setCategories({...auxCategories, isLoading: false });
  };

  useEffect(() => {
    getCategories();
  }, [authState]);

  return (
    <ProductContext.Provider
      value={{
        categories,
        getCategories,
      }}>
      {authState.isLoading || categories.isLoading ? (
        <Loading/>
      ) : (
        children
      )}
    </ProductContext.Provider>
  );
};