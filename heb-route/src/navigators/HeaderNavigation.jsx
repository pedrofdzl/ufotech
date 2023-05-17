import React from 'react';
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { BsArrowLeftCircle } from 'react-icons/bs';

const HeaderNavitagion = props => {
  const navigate = useNavigate();
  const location = useLocation();

  const { params } = props

  return (
    <div className='header-navigate'>
      <BsArrowLeftCircle className='header-navigate-icon' onClick={() =>
        navigate({
          // pathname: '/dashboard'
          // pathname:location.state.prev,
          pathname: (location.state?.prev) ? location.state.prev : '/',
          // search:`?${createSearchParams(params)}`
          search: (location.state?.search) ? location.state.search : ''
        })
      } />
    </div>
  );
};

export default HeaderNavitagion;
