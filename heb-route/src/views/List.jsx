import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';
import { ModalContext } from '../providers/ModalProvider';

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

  const [list, setList] = useState(lists.myLists[listID]);

  const [listTotal, setListTotal] = useState(lists.myLists[listID].total);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setList(lists.myLists[listID]);
    setListTotal(lists.myLists[listID].total);
  }, [lists]);

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
      pathname: (location.state?.prev) ? location.state.prev : '/',
      search: (location.state?.search) ? location.state.search : ''
    })
  };

  return (
    <>
      <HeaderNavitagion params={{ tab: 'Lists' }} />
      <div className='safe-area'>
        <div className='view-header'>
          <Text variant={'h1'}>{list.name}</Text>
          <FiMoreHorizontal onClick={() => openListEditModal()} style={{ fontSize: 24, paddingRight: 8 }} />
        </div>
        <Text variant={'small'} styles={{ margin: 0 }}>
          Creada por {list.owner} el {list?.createdDate.getDate()} de{' '}
          {monthString[list?.createdDate.getMonth()]}.{' '}
          {list?.createdDate.getFullYear()}
        </Text>

        {Object.keys(list.products).map((product) => {
          const currentProduct = categories.categories[list.products[product].category].products.find(
            (auxProduct) => auxProduct.id === product);
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
                  <Text
                    variant={'b1'}
                    styles={{ marginTop: 0, marginBottom: 2, fontSize: 16 }}>
                    {currency(
                      list.products[currentProduct.id].quantity * currentProduct.Precio
                    )}
                  </Text>
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
                  <Text variant={'b3'} styles={{ margin: 0 }}>
                    {currentProduct.Capacidad} {currentProduct.Unidad}
                  </Text>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <div className='list-product-quantity'>
                  <Text variant={'b1'}>{list.products[currentProduct.id].quantity}</Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='list-bottom'>
        <div style={{ display: 'flex', flexDirection: 'column', margin: 24 }}>
          <Text styles={{ fontSize: 20, fontWeight: 400, marginBottom: 4 }}>Total</Text>
          <Text styles={{ fontSize: 24 }}>{currency(listTotal)}</Text>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', margin: 24 }}>
          <Button variant='add-large'>Iniciar ruta</Button>
        </div>
      </div>
      {Object.keys(list.products).length <= 0 && <div className='list-empty'>
        <Text variant={'b4'}>No has agregado productos a esta lista</Text>
        <Button>Ir a catalogo</Button>
      </div>}
    </>
  );
};

export default List;