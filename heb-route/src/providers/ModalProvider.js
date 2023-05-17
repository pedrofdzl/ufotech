import React, { useState, useEffect } from 'react';

// Components
import { ListEditModal } from '../components/modals/ListEditModal';
import { ListProductModal } from '../components/modals/ListProductModal';
import { ProductModal } from '../components/modals/ProductModal';
import { ListModal } from '../components/modals/ListModal';

const defaultModalContext = {
  productModalOpen: false,
  productModalPayload: {
    currentCategory: null,
    currentProduct: null,
    currentQuantity: 0,
    selectedList: null,
  },
  listModalOpen: false,
  listModalPayload: {
    currentName: '',
  },
  listProductModalOpen: false,
  listProductModalPayload: {
    currentCategory: null,
    currentProduct: null,
    currentQuantity: 0,
    selectedList: null,
  },
  listEditModalOpen: false,
  listEditModalPayload: {
    currentName: '',
    currentList: null,
    onClose: () => {},
  },
  setProductModalOpen: () => {},
  setProductModalPayload: () => {},
  setListModalOpen: () => {},
  setListModalPayload: () => {},
  setListProductModalOpen: () => {},
  setListProductModalPayload: () => {},
  setListEditModalOpen: () => {},
  setListEditModalPayload: () => {},
};

export const ModalContext = React.createContext(defaultModalContext);

export const ModalProvider = ({ children }) => {
  const [productModalOpen, setProductModalOpen] = useState(
    defaultModalContext.productModalOpen
  );
  const [productModalPayload, setProductModalPayload] = useState(
    defaultModalContext.productModalPayload
  );
  const [listModalOpen, setListModalOpen] = useState(
    defaultModalContext.listModalOpen
  );
  const [listModalPayload, setListModalPayload] = useState(
    defaultModalContext.listModalPayload
  );
  const [listProductModalOpen, setListProductModalOpen] = useState(
    defaultModalContext.listProductModalOpen
  );
  const [listProductModalPayload, setListProductModalPayload] = useState(
    defaultModalContext.listProductModalPayload
  );
  const [listEditModalOpen, setListEditModalOpen] = useState(
    defaultModalContext.listModalOpen
  );
  const [listEditModalPayload, setListEditModalPayload] = useState(
    defaultModalContext.listModalPayload
  );

  useEffect(() => {
    if (productModalPayload.currentQuantity < 1) {
      setProductModalPayload({
        ...productModalPayload,
        currentQuantity: 1,
      });
    }
  }, [productModalPayload]);

  useEffect(() => {
    if (listProductModalPayload.currentQuantity < 0) {
      setListProductModalPayload({
        ...listProductModalPayload,
        currentQuantity: 0,
      });
    }
  }, [listProductModalPayload]);

  return (
    <ModalContext.Provider
      value={{
        productModalOpen,
        productModalPayload,
        listModalOpen,
        listModalPayload,
        listProductModalOpen,
        listProductModalPayload,
        listEditModalOpen,
        listEditModalPayload,
        setProductModalOpen,
        setProductModalPayload,
        setListModalOpen,
        setListModalPayload,
        setListProductModalOpen,
        setListProductModalPayload,
        setListEditModalOpen,
        setListEditModalPayload,
      }}>
      {listEditModalOpen && <ListEditModal />}
      {listProductModalOpen && <ListProductModal />}
      {productModalOpen && <ProductModal />}
      {listModalOpen && <ListModal />}
      {children}
    </ModalContext.Provider>
  );
};
