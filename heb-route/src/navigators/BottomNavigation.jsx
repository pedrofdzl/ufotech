import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

// Views
import Dashboard from '../views/Dashboard';
import Profile from '../views/Profile';
import Lists from '../views/Lists';

// Stylesheets
import '../stylesheets/Navigation.css';

// Icons
import { AiOutlineShop, AiOutlineShoppingCart } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';

// Providers
import { ModalContext } from '../providers/ModalProvider';

const validRoutes = ['Dashboard', 'Lists', 'Profile'];

const BottomNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setJoinModalOpen, setJoinModalPayload } = useContext(ModalContext);
  
  const [currentTab, setCurrentTab] = useState('Dashboard');

  useEffect(() => {
    const currTab = searchParams.get('tab');

    if (!currTab || !validRoutes.includes(currTab)) setCurrentTab('Dashboard');
    else setCurrentTab(currTab);

    const listInviteID = searchParams.get('listInviteID');
    if (listInviteID) {
      setCurrentTab('Lists');
      setJoinModalPayload({
        currentList: listInviteID,
      });
      setJoinModalOpen(true);
      searchParams.delete('listInviteID');
      setSearchParams(searchParams);
    }
  }, []);

  return (
    <>
      <div className='children-container'>
        {currentTab === 'Lists' && <Lists/>}
        {currentTab === 'Dashboard' && <Dashboard />}
        {currentTab === 'Profile' && <Profile />}
      </div>
      <div className='bottom-navigation'>
        <button>
          <AiOutlineShoppingCart
            onClick={() => {
              setSearchParams({ tab: 'Lists' });
              setCurrentTab('Lists');
            }}
            className='bottom-navigation-icon'
            style={currentTab === 'Lists' && { color: '#000000' }}
          />
        </button>
        <button>
          <AiOutlineShop
            onClick={() => {
              setSearchParams({ tab: 'Dashboard' });
              setCurrentTab('Dashboard');
            }}
            className='bottom-navigation-icon'
            style={currentTab === 'Dashboard' && { color: '#000000' }}
          />
        </button>
        <button>
          <BsPerson
            onClick={() => {
              setSearchParams({ tab: 'Profile' });
              setCurrentTab('Profile');
            }}
            className='bottom-navigation-icon'
            style={currentTab === 'Profile' && { color: '#000000' }}
          />
        </button>
      </div>
    </>
  );
};

export default BottomNavigation;
