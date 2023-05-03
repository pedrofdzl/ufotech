import React from 'react';
import { useNavigate } from 'react-router-dom';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { BsArrowLeftCircle } from 'react-icons/bs';

const HeaderNavitagion = () => {
  const navigate = useNavigate();

  return (
    <div className='header-navigate'>
      <BsArrowLeftCircle className='header-navigate-icon' onClick={() => navigate('/dashboard')} />
    </div>
  );
};

export default HeaderNavitagion;
