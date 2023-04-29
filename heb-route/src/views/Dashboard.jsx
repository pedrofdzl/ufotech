import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';
import '../stylesheets/Products.css';
// import '../stylesheets/SideList.css';

// Database
import { db } from '../firebase/firebase'
import { getDocs, collection, query, where, limit } from 'firebase/firestore'
 

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categoriasIcons, setCategoriasIcons] = useState();
  const [categoriesList, setCategoriesList] = useState();

  useEffect(()=>{
    let getProductInformation = async()=>{
      let categoriasCollection = collection(db, 'Categorias');

      // Set Categorias
      let categoriesSnapshot = [];

      // Get Query
      const categorias = await getDocs(categoriasCollection);
      categorias.forEach(doc=>{
        categoriesSnapshot.push({id:doc.id, ...doc.data()})
      });

      // Create Category Icons
      let helper = categoriesSnapshot.map(categoria=>{
        return <a key={categoria.id} className='category-card' href={`/categories/${categoria.id}`}>
            <h4>{categoria.Nombre}</h4>
        </a>
      });
      setCategoriasIcons(helper);


      // Create Category Products Icon
      let categoriesProducts = [];


      const products_collection = collection(db, 'Productos')
      let categoryProdsJSX = [];
      
      // Generate Product List For each Category
      categoriesSnapshot.forEach(async(category)=>{

        // Get Products per category
        let categoryProductsQuery = query(products_collection, where('Categoria', '==', `${category.id}`), limit(5));
        let categoryProductsDocs =  await getDocs(categoryProductsQuery)
        let categoryProductsList = [];


        // Map Query of Products
        categoryProductsDocs.forEach(doc=>{
          let helper = {id: doc.id, ...doc.data()};
          categoryProductsList.push(helper)
        });


        // Generate Product List
        categoryProdsJSX = categoryProductsList.map(product=>{
            return <a key={product.id} className="product-card" href={`/product/${product.id}`}>
                <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
                  <h4>{product.Nombre}</h4>
                  <small>${product.Precio}</small>
              </a>
        });

        // Get main Category Card
        let helper = <div key={category.id} className="product-category">
               <h3>{category.Nombre}</h3>
               <div className='product-card-carousel'>
                   {categoryProdsJSX}
                  {/* <Link className='view-all-btn' to={'/categories/'+c.nombre}>View All</Link> */}
               </div>
          </div>

          // Update and Regenerate Category
         categoriesProducts.push(helper);  
         setCategoriesList(categoriesProducts)
      });
    }
    getProductInformation();
  }, []);

  return (
    <>
    {currentUser && <>
        <Text>Productos</Text>
        
        <div className="category-card-carousel">
          {categoriasIcons}
        </div>

        {categoriesList}
    </>}
    </>
  );
};

export default Dashboard;