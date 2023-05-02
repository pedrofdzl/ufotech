import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { ProductContext } from "../providers/ProductProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';
import '../stylesheets/Products.css';

const Dashboard = () => {
  const { categories } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  return (
    <>
      <Text>Productos</Text>
      
      <div className="category-card-carousel">
        {Object.keys(categories.categories).map(category => {
          return (
            <a className='category-card' href={`/categories/${category}`}>
              <h4>{categories.categories[category].name}</h4>
            </a>
          );
        })}
      </div>

      {Object.keys(categories.categories).map(category => {
        return (
          <div className="product-category">
            <h3>{categories.categories[category].name}</h3>
            <div className='product-card-carousel'>
              {categories.categories[category].products.map(product => {
                return(
                  <a className="product-card" href={`/product/${product.id}`}>
                    <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
                    <h4>{product.Nombre}</h4>
                    <small>${product.Precio}</small>
                  </a>
                );
              })}
          </div>
        </div>
        );
      })}

    </>
  );
};

export default Dashboard;