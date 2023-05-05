import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { ProductContext } from "../providers/ProductProvider";

// Components
import { Text } from "../components/ui/Text";

// Utils
import { truncate } from '../utils/utils';

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
            <a className='category-card' style={{ backgroundColor: categories.categories[category].color }} onClick={() => navigate(`/categories/${category}`)} key={category}>
              <h1>{categories.categories[category].emoji}</h1>
              <h4>{categories.categories[category].name}</h4>
            </a>
          );
        })}
      </div>

      {Object.keys(categories.categories).map(category => {
        return (
          <div className="product-category" key={category}>
            <br/>
            <Text variant={'h4'}>{categories.categories[category].name}</Text>
            <div className='product-card-carousel'>
              {categories.categories[category].products.slice(0, 5).map(product => {
                return(
                  <a className="product-card" onClick={() => navigate(`/products/${category}/${product.id}`)} key={product.id}>
                    <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
                    <h4>{truncate(product.Nombre, 32)}</h4>
                    <small>${product.Precio}</small>
                    <small className="product-card-unit">{product.Capacidad} {product.Unidad}</small>
                  </a>
                );
              })}
              <a className="product-category-see-more" onClick={() => navigate(`/categories/${category}`)}>
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