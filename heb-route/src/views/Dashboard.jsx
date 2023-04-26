import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';
import '../stylesheets/SideList.css';

// Database
import { db } from '../firebase/firebase'
import { getDocs, collection, query, where, limit } from 'firebase/firestore'
 

const Dashboard = () => {
  const { currentUser, providerLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    providerLogout();
    navigate('/');
  };

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
        return <li key={categoria.id}>
            <h4>{categoria.Nombre}</h4>
        </li>
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
    getProductInformation();
  }, []);

  return (
    <>
    {currentUser ?
      <div className="auth-container">
        <Text>Bienvenido de vuelta <span>{ currentUser.email }</span>!</Text>

        <ul className="categories">
          {categoriasIcons}
        </ul>

        {categoriesList}


        <Button callbackFunction={() => logout()}>Cerrar sesión</Button>
      </div> : <></>
    }
    </>
  );
};

export default Dashboard;