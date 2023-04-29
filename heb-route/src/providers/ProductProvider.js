import React, { useContext, useEffect, useState } from 'react';

// Database
import { db } from '../firebase/firebase'
import { doc, getDocs } from 'firebase/firestore'

// Views
import Loading from '../views/Loading';

// Providers
import { AuthContext } from "../providers/AuthProvider";

const defaultProductContext = {
  categories: {
    categories: [],
    isLoading: true,
  },
  getCategories: async () => {},
};

export const ProductContext = React.createContext();

export const ProductProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);

  const [categories, setCategories] = useState(defaultProductContext.categories);
  
  const getCategories = async () => {
    if (authState.user?.email){
      let categoriasCollection = collection(db, 'Categorias');

      // Set Categorias
      let categoriesSnapshot = [];

      // Get Query
      const categorias = await getDocs(categoriasCollection);
      categorias.forEach(doc=>{
        categoriesSnapshot.push({id:doc.id, ...doc.data()})
      });

      const products_collection = collection(db, 'Productos')
      
      // Generate Product List For each Category
      categoriesSnapshot.forEach(async(category)=>{

        // Get Products per category
        let categoryProductsQuery = query(products_collection, where('Categoria', '==', `${category.id}`));
        let categoryProductsDocs =  await getDocs(categoryProductsQuery)
        let categoryProductsList = [];


        // Map Query of Products
        categoryProductsDocs.forEach(doc=>{
          let helper = {id: doc.id, ...doc.data()};
          categoryProductsList.push(helper)
        });


        // Generate Product List
        categoryProdsJSX = categoryProductsList.map(product=>{
            return <div key={product.id} className="product-card">
                <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
                  <div className='product-card-text'>
                    <h4>{product.Nombre}</h4>
                  </div>
              </div>
        });

        // Get main Category Card
        let helper = <div key={category.id}>
                <h3>{category.Nombre}</h3>
                <div className='categories-products'>
                    {categoryProdsJSX}
                  {/* <Link className='view-all-btn' to={'/categories/'+c.nombre}>View All</Link> */}
                </div>
          </div>

          // Update and Regenerate Category
          categoriesProducts.push(helper);  
          setCategoriesList(categoriesProducts)
      });
    }
  }

  useEffect(() => {
    getCategories();
  }, [authState]);

  return (
    <ProductContext.Provider
      value={{
        categories,
        getCategories,
      }}>
      {authState.isLoading && categories.isLoading ? (
        <Loading/>
      ) : (
        children
      )}
    </ProductContext.Provider>
  );
};