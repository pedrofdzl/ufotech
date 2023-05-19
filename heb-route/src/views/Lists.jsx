import React, { useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// Providers
import { ListContext } from '../providers/ListProvider';
import { ModalContext } from '../providers/ModalProvider';

// Components
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';

// Stylesheets
import '../stylesheets/Lists.css';

// Enums
import { monthString } from '../utils/enums';

// Utils
import { currency } from '../utils/utils';

// Icons
import { BsChevronRight, BsPencilSquare } from 'react-icons/bs';

const Lists = () => {
  const { lists, getMyLists } = useContext(ListContext);
  const { setListModalOpen, setListModalPayload } = useContext(ModalContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getMyLists();
    window.scrollTo(0, 0);
  }, []);

  const openListModal = () => {
    setListModalPayload({ currentName: '' });
    setListModalOpen(true);
  };

  return (
    <>
      <div className='view-header'>
        <Text variant={'h1'}>Mis listas</Text>
        <Button variant='add-list' callbackFunction={() => openListModal()}>
          <BsPencilSquare />
        </Button>
      </div>

      {Object.keys(lists?.myLists).map((lista, index) => {
        return (
          <div key={lista}>
            <Link
              to={`/lists/${lista}`}
              state={{ prev: location.pathname, search: location.search }}>
              <div className='list'>
                <div>
                  <Text
                    variant={'b1'}
                    styles={{ marginTop: 0, marginBottom: 8 }}>
                    {lists?.myLists[lista]?.name}
                  </Text>
                  <Text variant={'b3'} styles={{ margin: 0 }}>
                    {lists?.myLists[lista]?.createdDate.getDate()}{' '}
                    {monthString[lists?.myLists[lista]?.createdDate.getMonth()]}
                    . {lists?.myLists[lista]?.createdDate.getFullYear()}
                  </Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      variant={'b5'}
                      styles={{
                        marginTop: 4,
                        marginBottom: 8,
                        color: '#353841',
                        fontWeight: 500,
                      }}>
                      {currency(lists?.myLists[lista]?.total)}
                    </Text>
                    <Text variant={'b5'} styles={{ margin: 0 }}>
                      {Object.keys(lists?.myLists[lista]?.products).length} articulos
                    </Text>
                  </div>
                  <BsChevronRight
                    style={{ color: '#9DA2B0', fontSize: 24, marginLeft: 12 }}
                  />
                </div>
              </div>
            </Link>
            {index + 1 < Object.keys(lists?.myLists).length && (
              <div className='hr' />
            )}
          </div>
        );
      })}
    </>
  );
};

export default Lists;
