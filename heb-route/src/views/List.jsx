import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Firebase
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

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
    listProductModalOpen,
    setListProductModalOpen,
    setListProductModalPayload,
    setListEditModalOpen,
    setListEditModalPayload,
  } = useContext(ModalContext);

  const [products, setProducts] = useState({});
  const list = lists.myLists[listID];

  const [listTotal, setListTotal] = useState(lists.myLists[listID].total);

  const fetchList = () => {
    let auxTotal = 0;
    const listProductCollection = collection(db, 'listProduct');
    const listProductsQuery = query(
      listProductCollection,
      where('list', '==', listID)
    );
    let auxProducts = {};
    getDocs(listProductsQuery).then((productsSnapshot) => {
      productsSnapshot.forEach((prod) => {
        let data = prod.data();
        let auxProd = categories?.categories[data.category].products.find(
          (product) => product.id === data.product
        );
        auxProducts[data.product] = {
          ...auxProd,
          category: data.category,
          quantity: data.quantity,
          relacion: prod.id,
        };
        auxTotal += data.quantity * auxProd.Precio;
        setListTotal(auxTotal);
      });
      Object.keys(products).forEach((product) => {
        if (!auxProducts[product]) delete products[product];
      });
      setProducts({ ...auxProducts });
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchList();
  }, [listProductModalOpen]);

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
        <Text variant={'small'}>
          Creada por {list.owner} el {list?.createdDate.getDate()} de{' '}
          {monthString[list?.createdDate.getMonth()]}.{' '}
          {list?.createdDate.getFullYear()}
        </Text>

        {Object.keys(products).map((product) => {
          return (
            <div
              key={product}
              className='list-product'
              onClick={() => {
                openListProductModal({
                  productID: product,
                  categoryID: products[product].category,
                  quantity: products[product].quantity,
                });
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <img
                  src={products[product]['Link Imagen']}
                  alt={products[product].Nombre}
                />
                <div>
                  <Text
                    variant={'b1'}
                    styles={{ marginTop: 0, marginBottom: 2, fontSize: 16 }}>
                    {currency(
                      products[product].quantity * products[product].Precio
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
                    {truncate(products[product].Nombre, 28)}
                  </Text>
                  <Text variant={'b3'} styles={{ margin: 0 }}>
                    {products[product].Capacidad} {products[product].Unidad}
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
                  <Text variant={'b1'}>{products[product].quantity}</Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className='list-bottom'>
        <div style={{ display: 'flex', flexDirection: 'column', margin: 24 }}>
          <Text styles={{ fontSize: 20, fontWeight: 400, marginBottom: 4 }}>Total</Text>
          <Text styles={{ fontSize: 24 }}>{currency(listTotal)}</Text>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', margin: 24 }}>
          <Button variant='add-large'>Iniciar ruta</Button>
        </div>
      </div>
    </>
  );
};

export default List;
