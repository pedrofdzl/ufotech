import React, { useState } from 'react';

// Views
import Dashboard from '../views/Dashboard';
import Profile from '../views/Profile';
import Lists from '../views/Lists';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { AiOutlineShop } from 'react-icons/ai';
import { BsPerson, BsListCheck } from 'react-icons/bs';

const BottomNavigation = () => {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  
  return (
    <>
      <div className='children-container'>
        {currentTab === 'Lists' && <Lists/>}
        {currentTab === 'Dashboard' && <Dashboard/>}
        {currentTab === 'Profile' && <Profile/>}
      </div>
      <div className='bottom-navigation'>
        <button>
          <BsListCheck onClick={() => setCurrentTab('Lists')} className='bottom-navigation-icon' style={currentTab === 'Lists' && { color: '#000000' }}/>
        </button>
        <button>
          <AiOutlineShop onClick={() => setCurrentTab('Dashboard')} className='bottom-navigation-icon' style={currentTab === 'Dashboard' && { color: '#000000' }}/>
        </button>
        <button>
          <BsPerson onClick={() => setCurrentTab('Profile')} className='bottom-navigation-icon' style={currentTab === 'Profile' && { color: '#000000' }}/>
        </button>
      </div>
    </>
  );
};

export default BottomNavigation;