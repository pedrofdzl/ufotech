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

// Icons
import { SlLocationPin } from 'react-icons/sl';
import { BsArrowRightCircle } from 'react-icons/bs';

const Dashboard = () => {
  const navigate = useNavigate();
  const { categories } = useContext(ProductContext);

  return (
    <>
      <div className="location">
      <SlLocationPin />
        <Text variant={'b2'}>Sucursal Av. Manuel Gómez Morín</Text>
      </div>
      <Text variant={'h2'}>Categorias</Text>
      
      <div className="category-card-carousel">
        {Object.keys(categories.categories).map(category => {
          return (
            <a className='category-card' style={{ backgroundColor: categories.categories[category].color }} href={`/categories/${category}`}>
              <h1>{categories.categories[category].emoji}</h1>
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
              {categories.categories[category].products.slice(0, 5).map(product => {
                return(
                  <a className="product-card" href={`/product/${product.id}`}>
                    <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
                    <h4>{product.Nombre}</h4>
                    <small>${product.Precio}</small>
                    <small className="product-card-unit">{product.Capacidad} {product.Unidad}</small>
                  </a>
                );
              })}
              <a className="product-category-see-more" href={`/categories/${category}`}>
                <BsArrowRightCircle className="product-category-see-more-icon" />
                <Text variant="b4">Ver más</Text>
              </a>
          </div>
        </div>
        );
      })}

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

    </>
  );
};

export default Dashboard;