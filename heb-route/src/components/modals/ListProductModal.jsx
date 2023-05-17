import React, { useContext, useState, useEffect } from 'react';

// UI
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';

// Stylesheets
import '../../stylesheets/Modals.css';

// Providers
import { ListContext } from '../../providers/ListProvider';
import { ModalContext } from '../../providers/ModalProvider';
import { ProductContext } from '../../providers/ProductProvider';

// Components
import { Modal } from './Modal';

// Database
import { db } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  getDocs,
} from 'firebase/firestore';

// Icons
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

// Utils
import { currency } from '../../utils/utils';

export const ListProductModal = () => {
  const {
    listProductModalPayload,
    setListProductModalOpen,
    setListProductModalPayload,
  } = useContext(ModalContext);
  const { categories } = useContext(ProductContext);
  const { lists } = useContext(ListContext);

  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

  const product = categories?.categories[
    listProductModalPayload.currentCategory
  ].products.find(
    (product) => product.id === listProductModalPayload.currentProduct
  );

  useEffect(() => {
    if (listProductModalPayload.selectedList?.length > 0) {
      setSubmitButtonActive(true);
    } else {
      setSubmitButtonActive(false);
    }
  }, [listProductModalPayload]);

  const updateList = (auxProduct, diff) => {
    const listReference = doc(db, 'Listas', auxProduct.list);
    const currentCount = lists?.myLists[auxProduct.list].itemCount;
    const currentTotal = lists?.myLists[auxProduct.list].total;
    updateDoc(listReference, {
      ItemCount: currentCount + diff,
      Total: currentTotal + diff * product.Precio,
    });
  };

  const addProduct = () => {
    if (listProductModalPayload.selectedList != '') {
      const auxProduct = {
        list: listProductModalPayload.selectedList,
        category: listProductModalPayload.currentCategory,
        product: listProductModalPayload.currentProduct,
        quantity: listProductModalPayload.currentQuantity,
      };

      const listProductCollection = collection(db, 'listProduct');
      const listProductQuery = query(
        listProductCollection,
        where('list', '==', auxProduct.list),
        where('product', '==', auxProduct.product),
        limit(1)
      );
      getDocs(listProductQuery).then((listProductSnapshot) => {
        const listproductReference = doc(
          db,
          'listProduct',
          listProductSnapshot.docs[0].id
        );
        const data = listProductSnapshot.docs[0].data();
        if (auxProduct.quantity === 0) {
          deleteDoc(listproductReference).then(() => {
            updateList(auxProduct, auxProduct.quantity - data['quantity']);
            setSubmitButtonLoading(false);
            setListProductModalOpen(false);
          });
        } else {
          updateDoc(listproductReference, {
            quantity: auxProduct.quantity,
          }).then(() => {
            updateList(auxProduct, auxProduct.quantity - data['quantity']);
            setSubmitButtonLoading(false);
            setListProductModalOpen(false);
          });
        }
      });
    }
  };

  return (
    <Modal setIsOpen={setListProductModalOpen} title={'Editar compra'}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <img
          className='modal-product-image'
          src={product['Link Imagen']}
          alt={product.Nombre}
        />
        <div>
          <Text variant={'h5'} styles={{ margin: 0 }}>
            {product.Nombre}
          </Text>
          <Text variant={'b4'} styles={{ margin: 0 }}>
            {currency(product.Precio)}
          </Text>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
            <Button
              variant={'add-small'}
              callbackFunction={() =>
                setListProductModalPayload({
                  ...listProductModalPayload,
                  currentQuantity: listProductModalPayload.currentQuantity - 1,
                })
              }>
              <AiOutlineMinus />
            </Button>
            <div className='modal-product-quantity-number'>
              <Text variant={'b4'}>{listProductModalPayload.currentQuantity}</Text>
            </div>
            <Button
              variant={'add-small-2'}
              callbackFunction={() =>
                setListProductModalPayload({
                  ...listProductModalPayload,
                  currentQuantity: listProductModalPayload.currentQuantity + 1,
                })
              }>
              <AiOutlinePlus />
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant={listProductModalPayload.currentQuantity === 0 ? 'remove-large' : 'add-large'}
        styles={{ marginTop: 16 }}
        disabled={!submitButtonActive}
        loading={submitButtonLoading}
        callbackFunction={() => {
          setSubmitButtonLoading(true);
          addProduct();
        }}>
        {listProductModalPayload.currentQuantity === 0 ? 'Eliminar' : 'Confirmar'}
      </Button>
    </Modal>
  );
};
