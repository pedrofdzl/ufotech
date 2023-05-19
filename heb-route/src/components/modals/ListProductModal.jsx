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

// Icons
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

export const ListProductModal = () => {
  const {
    listProductModalPayload,
    setListProductModalOpen,
    setListProductModalPayload,
  } = useContext(ModalContext);
  const { categories } = useContext(ProductContext);
  const { editProduct } = useContext(ListContext);

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

  const editProductHandler = () => {
    editProduct({
      list: listProductModalPayload.selectedList,
      product: listProductModalPayload.currentProduct,
      quantity: listProductModalPayload.currentQuantity,
      success: () => {
        setSubmitButtonLoading(false);
        setListProductModalOpen(false);
      },
    });
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
            ${product.Precio}
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
              <Text variant={'b4'}>
                {listProductModalPayload.currentQuantity}
              </Text>
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
        variant={
          listProductModalPayload.currentQuantity === 0
            ? 'remove-large'
            : 'add-large'
        }
        styles={{ marginTop: 16 }}
        disabled={!submitButtonActive}
        loading={submitButtonLoading}
        callbackFunction={() => {
          setSubmitButtonLoading(true);
          editProductHandler();
        }}>
        {listProductModalPayload.currentQuantity === 0
          ? 'Eliminar'
          : 'Confirmar'}
      </Button>
    </Modal>
  );
};
