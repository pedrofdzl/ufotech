import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

// Components
import { Text } from "../components/ui/Text";

import { SlLocationPin } from 'react-icons/sl';
import { ProductContext } from '../providers/ProductProvider';

import '../stylesheets/Products.css';

// Utils
import { truncate } from '../utils/utils';

const Search = props =>{
    const { categories } = useContext(ProductContext)
    const [searchInput, setSearchInput] = useState('');
    const [searchParams] = useSearchParams();
    const [prods, setProds] = useState([]);

    const navigate = useNavigate();

    const searchHandler = event=>{
      event.preventDefault();
      getProds();
    };
  
    const onSearchChange = event=>{
      setSearchInput(event.target.value);
    };

    const getProds = () =>{
        // let sTerm = searchParams.get('search');
        let filteredProds = [];
        Object.keys(categories.categories).forEach(category=>{
            const categoryProds = categories.categories[category].products.filter(product=>{
                return product.Nombre.toLowerCase().includes(searchInput.toLowerCase())
            });
            filteredProds =  filteredProds.concat(categoryProds);
        });
        setProds(filteredProds);
    }


    useEffect(()=>{
        setSearchInput(searchParams.get('search'));
        getProds()
    },[])


    return <>
     <div className="location">
      <SlLocationPin />
        <Text variant={'b2'}>Sucursal Av. Manuel Gómez Morín</Text>
      </div>
      <div>
        <form onSubmit={searchHandler}>
          <input type="text" name="search" placeholder="Leche, Huevo, Cereal..." onChange={onSearchChange} value={searchInput}/>
        </form>
      </div>
      {prods.map(product=>{
        return(
            <Link className="product-card" to={`/products/${product.Categoria}/${product.id}`} key={product.id}>
              <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
              <h4>{truncate(product.Nombre, 32)}</h4>
              <small>${product.Precio}</small>
              <small className="product-card-unit">{product.Capacidad} {product.Unidad}</small>
            </Link>
          );
      })}
    
    </>
};

export default Search