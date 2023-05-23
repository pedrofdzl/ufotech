import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';
import { ModalContext } from '../providers/ModalProvider';
import { UserInformationContext } from '../providers/UserInformationProvider';

// Components
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';

// Utils
import { truncate, currency } from '../utils/utils';
import { monthString } from '../utils/enums';

// Icons
import { FiMoreHorizontal } from 'react-icons/fi';

// Stylesheets
import '../stylesheets/Lists.css';

import { http404 } from '../errorhandling/errors';

const List = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { listID } = useParams();
  const { lists } = useContext(ListContext);
  const { categories } = useContext(ProductContext);
  const {
    setListProductModalOpen,
    setListProductModalPayload,
    setListEditModalOpen,
    setListEditModalPayload,
  } = useContext(ModalContext);
  const { userInformation } = useContext(UserInformationContext);

  if (!(listID in lists.myLists)){
    throw new http404('List Not Found!');
  }


  const [list, setList] = useState(lists.myLists[listID]);
  const [isOwner] = useState(userInformation.email === list.owner);
  const [listTotal, setListTotal] = useState(lists.myLists[listID].total);
  const [routeReady, setRouteReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setList(lists.myLists[listID]);
    setListTotal(lists.myLists[listID].total);
  }, [lists, listID]);

  useEffect(() => {
    setRouteReady(Object.keys(list.products).length > 0 ? true : false);
  }, [list]);

  useEffect(() => {
    setRouteReady(Object.keys(list.products).length > 0 ? true : false);
  }, [list]);

  const openListProductModal = ({ productID, categoryID, quantity }) => {
    setListProductModalPayload({
      currentCategory: categoryID,
      currentProduct: productID,
      currentQuantity: quantity,
      selectedList: listID,
    });
    setListProductModalOpen(true);
  };

  const openListEditModal = () => {
    setListEditModalPayload({
      currentName: list.name,
      currentList: listID,
      onClose: () => goBack(),
    });
    setListEditModalOpen(true);
  };

  const goBack = () => {
    navigate({
      pathname: location.state?.prev ? location.state.prev : '/',
      search: location.state?.search ? location.state.search : '',
    });
  };



  return (
    <>
      <HeaderNavitagion params={{ tab: 'Lists' }} />
      <div className='safe-area'>
        <div className='view-header'>
          <Text variant={'h1'}>{list.name}</Text>
          {isOwner && (
            <FiMoreHorizontal
              onClick={() => openListEditModal()}
              style={{ fontSize: 24, paddingRight: 8 }}
            />
          )}
        </div>
        <Text variant={'small'} styles={{ margin: 0 }}>
          Creada por {list.owner} el {list?.createdDate.getDate()} de{' '}
          {monthString[list?.createdDate.getMonth()]}.{' '}
          {list?.createdDate.getFullYear()}
        </Text>
        <br />
        {Object.keys(list.products).map((product) => {
          const currentProduct = categories.categories[
            list.products[product].category
          ].products.find((auxProduct) => auxProduct.id === product);
          return (
            <div
              key={product}
              className='list-product'
              onClick={() => {
                openListProductModal({
                  productID: list.products[currentProduct.id].product,
                  categoryID: list.products[currentProduct.id].category,
                  quantity: list.products[currentProduct.id].quantity,
                });
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <img
                  src={currentProduct['Link Imagen']}
                  alt={currentProduct.Nombre}
                />
                <div>
                  <div
                    style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                    <Text
                      variant={'b1'}
                      styles={{ marginTop: 0, marginBottom: 2, fontSize: 16 }}>
                      {currency(
                        list.products[currentProduct.id].quantity *
                          currentProduct.Precio
                      )}
                    </Text>
                    {list.products[currentProduct.id]?.addedBy && (
                      <Text
                        variant={'b3'}
                        styles={{ margin: 0, marginBottom: 2 }}>
                        / {currentProduct.Capacidad} {currentProduct.Unidad}
                      </Text>
                    )}
                  </div>
                  <Text
                    variant={'b1'}
                    styles={{
                      marginTop: 0,
                      marginBottom: 4,
                      fontWeight: 400,
                      fontSize: 15,
                    }}>
                    {truncate(currentProduct.Nombre, 28)}
                  </Text>
                  {list.products[currentProduct.id]?.addedBy ? (
                    <Text
                      variant={'b3'}
                      styles={{ margin: 0, marginBottom: 2 }}>
                      Agregado por {list.products[currentProduct.id]?.addedBy}
                    </Text>
                  ) : (
                    <Text
                      variant={'b3'}
                      styles={{ margin: 0, marginBottom: 2 }}>
                      {currentProduct.Capacidad} {currentProduct.Unidad}
                    </Text>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <div className='list-product-quantity'>
                  <Text variant={'b1'}>
                    {list.products[currentProduct.id].quantity}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <div className='list-bottom'>
        <div style={{ display: 'flex', flexDirection: 'column', margin: 24 }}>
          <Text styles={{ fontSize: 20, fontWeight: 400, marginBottom: 4 }}>
            Total
          </Text>
          <Text styles={{ fontSize: 24 }}>{currency(listTotal)}</Text>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', margin: 24 }}>
          <Link
            to={`/route/${listID}`}
            state={{
              prev: location.pathname,
              search: location.search,
            }}
            style={!routeReady ? {pointerEvents: "none"} : {}}>
            <Button variant='add-large' disabled={!routeReady}>
              Iniciar ruta
            </Button>
          </Link>
        </div>
      </div>
      {Object.keys(list.products).length <= 0 && (
        <div className='list-empty'>
          <Text variant={'b4'}>No has agregado productos a esta lista</Text>
          <Button callbackFunction={() => navigate('/dashboard')}>
            Ir a catalogo
          </Button>
        </div>
      )}
    </>
  );
};

export default List;
