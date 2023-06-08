import React, { useContext, useEffect, useState } from 'react';

// Database
import { db } from '../firebase/firebase';
import { getDocs, collection } from 'firebase/firestore';

// Views
import Loading from '../views/Loading';

// Providers
import { AuthContext } from '../providers/AuthProvider';

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
  const [categories, setCategories] = useState(
    defaultProductContext.categories
  );

  const getCategories = async () => {
    const categoryCollection = collection(db, 'Categorias');
    const fetchedCategories = await getDocs(categoryCollection);
    fetchedCategories.forEach((doc) => {
      const data = doc.data();

      if (!categories?.categories?.[doc.id]) {
        let auxCategories = categories;
        auxCategories.categories[doc.id] = {
          name: data.Nombre,
          emoji: data.Emoji,
          color: data.Color ? data.Color : '#FFF',
          products: [],
        };
        setCategories(auxCategories);
      }
    });

    let auxNodos = {};
    const nodeCollection = collection(db, 'Sucursales');
    const fetchedNodes = await getDocs(nodeCollection);
    fetchedNodes.forEach((doc) => {
      let data = doc.data();
      let nodes = data?.nodes;
      let upcs = data?.upcs;
      for (let i = 0; i < nodes.length; i++) {
        auxNodos[upcs[i]] = nodes[i];
      }
    });

    // Productos
    let auxCategories = categories;
    const productsCollection = collection(db, 'Productos');
    const fetchedProducts = await getDocs(productsCollection);
    fetchedProducts.forEach((doc) => {
      let data = doc.data();
      if (
        !auxCategories?.categories?.[data.Categoria]?.products.find(
          (product) => product.id === doc.id
        )
      ) {
        auxCategories?.categories?.[data.Categoria]?.products.push({
          ...data,
          id: doc.id,
          node: auxNodos[data.UPC],
        });
      }
    });
    setCategories({ ...auxCategories, isLoading: false });
  };

  useEffect(() => {
    if (Object.keys(categories.categories).length === 0) {
      getCategories();
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        categories,
        getCategories,
      }}>
      {authState.isLoading || categories.isLoading ? <Loading /> : children}
    </ProductContext.Provider>
  );
};
