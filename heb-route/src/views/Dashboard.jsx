import React, { useContext, useState } from 'react';
import {
  useNavigate,
  createSearchParams,
  Link,
  useLocation,
} from 'react-router-dom';

// Providers
import { ModalContext } from '../providers/ModalProvider';
import { ProductContext } from '../providers/ProductProvider';

// Components
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/products/ProductCard';

// Utils
import { truncate, currency } from '../utils/utils';

// Stylesheets
import '../stylesheets/Dashboard.css';
import '../stylesheets/Products.css';

// Icons
import { SlLocationPin } from 'react-icons/sl';
import { BsArrowRightCircle } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const { categories } = useContext(ProductContext);
  const { productModalPayload, setProductModalOpen, setProductModalPayload } = useContext(ModalContext);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const searchHandler = (event) => {
    event.preventDefault();
    navigate({
      pathname: '/search',
      search: `?${createSearchParams({ search: searchTerm })}`,
    });
  };

  const onSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openProductModal = ({ product, category }) => {
    setProductModalPayload({...productModalPayload, currentProduct: product, currentCategory: category });
    setProductModalOpen(true);
  };

  return (
    <>
      <div className='view-header'>
        <div className='location'>
          <SlLocationPin />
          <Text variant={'b2'}>Sucursal Av. Manuel Gómez Morín</Text>
        </div>
        <div className='dashboard-profile-picture'>
          <img src='https://media.newyorker.com/photos/5ba177da9eb2f7420aadeb98/1:1/w_1003,h_1003,c_limit/Cohen-Linus-Torvalds.jpg' />
        </div>
      </div>
      <form style={{ position: 'relative' }} onSubmit={searchHandler}>
        <BiSearch
          style={{
            position: 'absolute',
            fontSize: 20,
            top: 17,
            left: 16,
            color: '#6e6e6e',
          }}
        />
        <input
          className='dashboard-search'
          type='text'
          name='search'
          placeholder='Buscar productos...'
          onChange={onSearchChange}
          value={searchTerm}
        />
      </form>
      <Text variant={'h2'}>Categorias</Text>

      <div className='category-card-carousel'>
        {Object.keys(categories.categories).map((category) => {
          return (
            <Link
              className='category-card'
              style={{ backgroundColor: categories.categories[category].color }}
              to={`/categories/${category}`}
              state={{ prev: location.pathname, search: location.search }}
              key={category}>
              <h1>{categories.categories[category].emoji}</h1>
              <h4>{categories.categories[category].name}</h4>
            </Link>
          );
        })}
      </div>

      {Object.keys(categories.categories).map((category) => {
        return (
          <div className='product-category' key={category}>
            <br />
            <Text variant={'h4'}>{categories.categories[category].name}</Text>
            <div className='product-card-carousel'>
              {categories.categories[category].products
                .slice(0, 5)
                .map((product) => {
                  return (
                    <ProductCard product={product} category={category} />
                  );
                })}
              <Link
                className='product-category-see-more'
                to={`/categories/${category}`}
                state={{ prev: location.pathname, search: location.search }}>
                <BsArrowRightCircle className='product-category-see-more-icon' />
                <Text variant='b4'>Ver más</Text>
              </Link>
            </div>
          </div>
        );
      })}

      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Dashboard;
