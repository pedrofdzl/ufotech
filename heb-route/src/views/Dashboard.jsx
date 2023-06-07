import React, { useContext, useState } from 'react';
import {
  useNavigate,
  createSearchParams,
  Link,
  useLocation,
} from 'react-router-dom';

// Providers
import { ProductContext } from '../providers/ProductProvider';
import { UserInformationContext } from "../providers/UserInformationProvider";

// Components
import { Text } from '../components/ui/Text';
import ProductCard from '../components/products/ProductCard';

// Stylesheets
import '../stylesheets/Dashboard.css';
import '../stylesheets/Products.css';

// Icons
import { SlLocationPin } from 'react-icons/sl';
import { BsArrowRightCircle } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';

// Default Image
import defaultProfileImage from '../assets/img/hebimage.png'

const Dashboard = (props) => {
  const navigate = useNavigate();
  const { categories } = useContext(ProductContext);
const { userInformation } = useContext(UserInformationContext);

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

  return (
    <>
      <div className='view-header'>
        <div className='location'>
          <SlLocationPin />
          <Text variant={'b22'}>Sucursal Av. Manuel Gómez Morín</Text>
        </div>
        <div className='dashboard-profile-picture'>
            {(userInformation.profilepic) ? 
              <img src={userInformation.profilepic} alt={'profile-pic'} />
              :
              <img src={defaultProfileImage} alt={'profile-pic'} />
            }
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
                    <ProductCard product={product} category={category} key={product.id} />
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
