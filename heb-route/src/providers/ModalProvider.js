import React, { useState, useEffect } from 'react';

// Components
import { ProductModal } from '../components/modals/ProductModal';

const defaultModalContext = {
  productModalOpen: false,
  productModalPayload: {
    currentCategory: null,
    currentProduct: null,
    currentQuantity: 0,
    selectedList: null,
  },
  setProductModalOpen: () => {},
  setProductModalPayload: () => {},
};

export const ModalContext = React.createContext(defaultModalContext);

export const ModalProvider = ({ children }) => {
  const [productModalOpen, setProductModalOpen] = useState(
    defaultModalContext.productModalOpen
  );
  const [productModalPayload, setProductModalPayload] = useState(
    defaultModalContext.productModalPayload
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
        setProductModalOpen,
        setProductModalPayload,
      }}>
      {productModalOpen && <ProductModal />}
      {children}
    </ModalContext.Provider>
  );
};
