import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Firebase
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';

// Components
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';

// Utils
import { truncate } from '../utils/utils';
import { monthString } from '../utils/enums';

// Stylesheets
import '../stylesheets/Lists.css';

const List = () => {
  const { listID } = useParams();
  const { lists } = useContext(ListContext);
  const { categories } = useContext(ProductContext);

  // const [list, setList] = useState({});
  const [products, setProducts] = useState({});
  const list = lists.myLists[listID];

  useEffect(() => {
    const listProductCollection = collection(db, 'listProduct');
    const listProductsQuery = query(
      listProductCollection,
      where('list', '==', listID)
    );
    let auxProducts = products;
    getDocs(listProductsQuery).then((productsSnapshot) => {
      productsSnapshot.forEach((prod) => {
        let data = prod.data();
        let auxProd = categories?.categories[data.category].products.find(
          (product) => product.id === data.product
        );
        auxProducts[data.product] = {
          ...auxProd,
          quantity: data.quantity,
          relacion: prod.id,
        };
        setProducts({ ...auxProducts });
      });
    });
  }, []);

  return (
    <>
      <HeaderNavitagion params={{ tab: 'Lists' }} />
      <div className='safe-area'>
        <Text styles={{ paddingTop: 24 }} variant={'h1'}>
          {list.name}
        </Text>
        <Text variant={'small'}>
          Creada por {list.owner} el {list?.createdDate.getDate()} de{' '}
          {monthString[list?.createdDate.getMonth()]}.{' '}
          {list?.createdDate.getFullYear()}
        </Text>

        {Object.keys(products).map((product) => {
          return (
            <div key={product} className='list-product'>
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
                    styles={{ marginTop: 0, marginBottom: 8, fontSize: 16 }}>
                    {truncate(products[product].Nombre, 26)}{' '}
                    {products[product].quantity > 1 &&
                      `(${products[product].quantity})`}
                  </Text>
                  <Text variant={'b3'} styles={{ margin: 0 }}>
                    Agregado por ti
                  </Text>
                </div>
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
                    $
                    {(
                      products[product].quantity * products[product].Precio
                    ).toFixed(2)}
                  </Text>
                  <Text variant={'b5'} styles={{ margin: 0 }}>
                    {products[product].Capacidad} {products[product].Unidad}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default List;
