import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';

// Components
import { Text } from '../components/ui/Text';

// Icons
import { BiSearch } from 'react-icons/bi';
import { ProductContext } from '../providers/ProductProvider';

// Stylesheets
import '../stylesheets/Products.css';
import '../stylesheets/Dashboard.css';

// Utils
import { truncate } from '../utils/utils';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';


const Search = () => {
  const { categories } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [prods, setProds] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParams.get('search'));

  const location = useLocation();

  const searchHandler = (event) => {
    event.preventDefault();
    setSearchParams({ search: searchInput });
    getProds();
  };

  const onSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const getProds = () => {
    // let sTerm = searchParams.get('search');
    let filteredProds = [];
    Object.keys(categories.categories).forEach((category) => {
      const categoryProds = categories.categories[category].products.filter(
        (product) => {
          return product.Nombre.toLowerCase().includes(
            searchInput.toLowerCase()
          );
        }
      );
      filteredProds = filteredProds.concat(categoryProds);
    });
    setProds(filteredProds);
  };

  useEffect(() => {
    getProds();
  }, []);

  return (
    <>
    <HeaderNavitagion/>
     <div className='safe-area'>
        <div style={{ height: 26 }}/>
        <form style={{ position: 'relative' }} onSubmit={searchHandler}>
          <BiSearch
            style={{
              position: 'absolute',
              fontSize: 20,
              top: 16,
              left: 16,
              color: '#6e6e6e',
            }}
          />
          <input
            className='search-search'
            type='text'
            name='search'
            placeholder='Buscar productos...'
            onChange={onSearchChange}
            value={searchInput}
          />
        </form>
        {prods.length === 0 && 
            <Text variant={'b2'} styles={{ 'textAlign': 'center' }}>No se encontraron resultados</Text>
        }
                {prods.map((product) => {
          return (
            // <Link className="product-card" to={`/products/${product.Categoria}/${product.id}`} state={{prev: location.pathname, search: location.search}} key={product.id}></Link>
            <Link
              className='product-card'
              to={`/products/${product.Categoria}/${product.id}`}
              state={{ prev: location.pathname, search: location.search }}>
              <img
                src={product['Link Imagen']}
                alt={product.Nombre}
                width={100}
                height={100}
              />
              <h4>{truncate(product.Nombre, 32)}</h4>
              <small>${product.Precio}</small>
                <small className='product-card-unit'>
                {product.Capacidad} {product.Unidad}
              </small>
            </Link>
          );
                  })}
      </div>
    </>
  );
};
export default Search;