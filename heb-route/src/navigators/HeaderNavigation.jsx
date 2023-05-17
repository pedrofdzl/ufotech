import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { BsChevronLeft } from 'react-icons/bs';

const HeaderNavitagion = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='header-navigate'>
      <BsChevronLeft className='header-navigate-icon' onClick={() =>
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
