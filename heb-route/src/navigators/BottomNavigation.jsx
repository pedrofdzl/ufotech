import React, { useState } from 'react';

// Views
import Dashboard from '../views/Dashboard';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { AiFillHome, AiOutlineUnorderedList } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';

const BottomNavigation = () => {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  
  return (
    <>        
      {currentTab === 'Dashboard' && <Dashboard/>}
      <div className='bottom-navigation'>
        <button>
          <AiOutlineUnorderedList onClick={() => setCurrentTab('Lists')} className='bottom-navigation-icon' style={currentTab === 'Lists' && { color: '#000000' }}/>
        </button>
        <button>
          <AiFillHome onClick={() => setCurrentTab('Dashboard')} className='bottom-navigation-icon' style={currentTab === 'Dashboard' && { color: '#000000' }}/>
        </button>
        <button>
          <BsFillPersonFill onClick={() => setCurrentTab('Profile')} className='bottom-navigation-icon' style={currentTab === 'Profile' && { color: '#000000' }}/>
        </button>
      </div>
    </>
  );
};

export default BottomNavigation;