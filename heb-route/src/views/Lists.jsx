import React, { useContext, useEffect, useState } from 'react';
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
import { BsChevronRight } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';

const Lists = () => {
  const { lists, getLists } = useContext(ListContext);
  const { setListModalOpen, setListModalPayload } = useContext(ModalContext);

  const [selectedTab, setSelectedTab] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getLists();
    window.scrollTo(0, 0);
  }, []);

  const openListModal = () => {
    setListModalPayload({ currentName: '' });
    setListModalOpen(true);
  };

  return (
    <>
      <div className='view-header'>
        <Text variant={'h2'}>Listas de compra</Text>
      </div>

      <div className='tab-selector'>
        <div
          className={selectedTab === 1 ? 'tab-selected' : ''}
          onClick={() => setSelectedTab(1)}>
          Individuales
        </div>
        <div
          className={selectedTab === 2 ? 'tab-selected' : ''}
          onClick={() => setSelectedTab(2)}>
          Compartidas
        </div>
      </div>

      {selectedTab === 1 && (
        <>
          {Object.keys(lists?.myLists).map((lista) => {
            if (lists.myLists[lista].type == 'private') {
              return (
                <div key={lista}>
                  <Link
                    to={`/lists/${lista}`}
                    state={{
                      prev: location.pathname,
                      search: location.search,
                    }}>
                    <div className='list'>
                      <div>
                        <Text
                          variant={'b2'}
                          styles={{
                            marginTop: 0,
                            marginBottom: 8,
                            fontWeight: 500,
                          }}>
                          {lists?.myLists[lista]?.name}
                        </Text>
                        <Text variant={'b3'} styles={{ margin: 0 }}>
                          {lists?.myLists[lista]?.createdDate.getDate()}{' '}
                          {
                            monthString[
                              lists?.myLists[lista]?.createdDate.getMonth()
                            ]
                          }
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
                            {
                              Object.keys(lists?.myLists[lista]?.products)
                                .length
                            }{' '}
                            articulos
                          </Text>
                        </div>
                        <BsChevronRight
                          style={{
                            color: '#9DA2B0',
                            fontSize: 24,
                            marginLeft: 12,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }
          })}
          <Button variant='add-list' callbackFunction={() => openListModal()}>
            <div className='list-new'>
              <Text
                styles={{
                  fontSize: 16,
                  margin: 0,
                  color: 'var(--gray)',
                  fontWeight: 400,
                }}>
                Nueva lista
              </Text>
              <AiOutlinePlus style={{ fontSize: 18 }} />
            </div>
          </Button>
        </>
      )}

      {selectedTab === 2 && (
        <>
          {Object.keys(lists?.myLists).map((lista) => {
            if (lists.myLists[lista].type == 'shared') {
              return (
                <div key={lista}>
                  <Link
                    to={`/lists/${lista}`}
                    state={{
                      prev: location.pathname,
                      search: location.search,
                    }}>
                    <div className='list'>
                      <div>
                        <Text
                          variant={'b2'}
                          styles={{
                            marginTop: 0,
                            marginBottom: 8,
                            fontWeight: 500,
                          }}>
                          {lists?.myLists[lista]?.name}
                        </Text>
                        <Text variant={'b3'} styles={{ margin: 0 }}>
                          {lists?.myLists[lista]?.createdDate.getDate()}{' '}
                          {
                            monthString[
                              lists?.myLists[lista]?.createdDate.getMonth()
                            ]
                          }
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
                            {
                              Object.keys(lists?.myLists[lista]?.products)
                                .length
                            }{' '}
                            articulos
                          </Text>
                        </div>
                        <BsChevronRight
                          style={{
                            color: '#9DA2B0',
                            fontSize: 24,
                            marginLeft: 12,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }
          })}
        </>
      )}
    </>
  );
};

export default Lists;
