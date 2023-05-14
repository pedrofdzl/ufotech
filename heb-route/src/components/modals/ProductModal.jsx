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

// Database
import { db } from '../../firebase/firebase';
import {
  addDoc,
  collection,
  query,
  where,
  doc,
  updateDoc,
  limit,
  getDocs,
} from 'firebase/firestore';

// Icons
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

export const ProductModal = () => {
  const { productModalPayload, setProductModalOpen, setProductModalPayload } =
    useContext(ModalContext);
  const { categories } = useContext(ProductContext);
  const { lists } = useContext(ListContext);

  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

  const product = categories?.categories[
    productModalPayload.currentCategory
  ].products.find(
    (product) => product.id === productModalPayload.currentProduct
  );

  useEffect(() => {
    if (productModalPayload.selectedList?.length > 0) {
      setSubmitButtonActive(true);
    } else {
      setSubmitButtonActive(false);
    }
  }, [productModalPayload]);

  const handleSelectList = (event) => {
    setProductModalPayload({
      ...productModalPayload,
      selectedList: event.target.value,
    });
  };

  const addProduct = () => {
    if (productModalPayload.selectedList != '') {
      const auxProduct = {
        list: productModalPayload.selectedList,
        category: productModalPayload.currentCategory,
        product: productModalPayload.currentProduct,
        quantity: productModalPayload.currentQuantity,
      };

      const listProductCollection = collection(db, 'listProduct');
      const listProductQuery = query(
        listProductCollection,
        where('list', '==', auxProduct.list),
        where('product', '==', auxProduct.product),
        limit(1)
      );
      getDocs(listProductQuery).then((listProductSnapshot) => {
        if (!(listProductSnapshot.size > 0)) {
          addDoc(listProductCollection, auxProduct).then(
            (listProductReference) => {
              setSubmitButtonLoading(false);
              setProductModalOpen(false);
            }
          );
        } else {
          const listproductReference = doc(
            db,
            'listProduct',
            listProductSnapshot.docs[0].id
          );
          const data = listProductSnapshot.docs[0].data();
          updateDoc(listproductReference, {
            quantity: data['quantity'] + auxProduct.quantity,
          }).then(() => {
            setSubmitButtonLoading(false);
            setProductModalOpen(false);
          });
        }
      });
    }
  };

  return (
    <>
      <div
        onClick={() => setProductModalOpen(false)}
        className='modal-background'></div>
      <div className='modal'>
        <div className='modal-header'>
          <Text variant={'h3'}>Añadir producto</Text>
          <Button
            variant={'close'}
            callbackFunction={() => setProductModalOpen(false)}>
            <AiOutlineClose />
          </Button>
        </div>

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
              ${product.Precio}
            </Text>
            <div
              style={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
              <Button
                variant={'add-small'}
                callbackFunction={() =>
                  setProductModalPayload({
                    ...productModalPayload,
                    currentQuantity: productModalPayload.currentQuantity - 1,
                  })
                }>
                <AiOutlineMinus />
              </Button>
              <div className='modal-product-quantity-number'>
                <Text variant={'b4'}>
                  {productModalPayload.currentQuantity}
                </Text>
              </div>
              <Button
                variant={'add-small-2'}
                callbackFunction={() =>
                  setProductModalPayload({
                    ...productModalPayload,
                    currentQuantity: productModalPayload.currentQuantity + 1,
                  })
                }>
                <AiOutlinePlus />
              </Button>
            </div>
          </div>
        </div>

        <select
          name='select'
          id='select'
          onChange={handleSelectList}
          defaultValue={productModalPayload.selectedList}>
          <option value=''>------------</option>
          {Object.keys(lists.myLists).map((lista) => {
            return (
              <option value={lista} key={lista}>
                {lists.myLists[lista].name}
              </option>
            );
          })}
        </select>

        <Button
          variant={'add-large'}
          styles={{ marginTop: 16 }}
          disabled={!submitButtonActive}
          loading={submitButtonLoading}
          callbackFunction={() => {
            setSubmitButtonLoading(true);
            addProduct();
          }}>
          Agregar{' '}
          {
            <span style={{ marginLeft: 4 }}>{`$${
              productModalPayload.currentQuantity * product.Precio
            }`}</span>
          }
        </Button>
      </div>
    </>
  );
};
