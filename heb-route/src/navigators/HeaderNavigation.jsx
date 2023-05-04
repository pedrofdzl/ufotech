import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { BsArrowLeftCircle } from 'react-icons/bs';

const HeaderNavitagion = props => {
  const navigate = useNavigate();

  const { params } = props

  return (
    <div className='header-navigate'>
      <BsArrowLeftCircle className='header-navigate-icon' onClick={() =>
        navigate({
          pathname:'/dashboard',
          search:`?${createSearchParams(params)}`
        })
      } />
    </div>
  );
};

export default HeaderNavitagion;
