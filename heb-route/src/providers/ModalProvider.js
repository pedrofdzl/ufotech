import React, { useState, useEffect } from 'react';

// Components
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
  setProductModalOpen: () => {},
  setProductModalPayload: () => {},
  setListModalOpen: () => {},
  setListModalPayload: () => {},
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

  useEffect(() => {
    if (productModalPayload.currentQuantity < 1) {
      setProductModalPayload({
        ...productModalPayload,
        currentQuantity: 1,
      });
    }
  }, [productModalPayload]);

  return (
    <ModalContext.Provider
      value={{
        productModalOpen,
        productModalPayload,
        listModalOpen,
        listModalPayload,
        setProductModalOpen,
        setProductModalPayload,
        setListModalOpen,
        setListModalPayload,
      }}>
      {productModalOpen && <ProductModal />}
      {listModalOpen && <ListModal />}
      {children}
    </ModalContext.Provider>
  );
};
