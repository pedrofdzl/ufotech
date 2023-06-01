import React, { useState, useEffect } from 'react';

// Components
import { ListEditModal } from '../components/modals/ListEditModal';
import { ListProductModal } from '../components/modals/ListProductModal';
import { RouteCompleteModal } from '../components/modals/RouteCompleteModal'
import { ProductModal } from '../components/modals/ProductModal';
import { ListModal } from '../components/modals/ListModal';
import { JoinModal } from '../components/modals/JoinModal';

// Stylesheets
import '../stylesheets/Modals.css';
import { DefaultContext } from 'react-icons';

const defaultModalContext = {
  productModalOpen: false,
  productModalPayload: {
    currentCategory: null,
    currentProduct: null,
    currentQuantity: 0,
    selectedList: null,
    success: ()=>{}
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
    onClose: () => { },
  },
  joinModalOpen: false,
  joinModalPayload: {
    currentList: null,
  },
  routeCompleteModalOpen: false,
  routeCompleteModalPayload: {
    onClose: () => { },
  },
  setProductModalOpen: () => { },
  setProductModalPayload: () => { },
  setListModalOpen: () => { },
  setListModalPayload: () => { },
  setListProductModalOpen: () => { },
  setListProductModalPayload: () => { },
  setListEditModalOpen: () => { },
  setListEditModalPayload: () => { },
  setJoinModalOpen: () => { },
  setJoinModalPayload: () => { },
  setRouteCompleteModalOpen: () => { },
  setRouteCompleteModalPayload: () => { },
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
    defaultModalContext.listEditModalOpen
  );
  const [listEditModalPayload, setListEditModalPayload] = useState(
    defaultModalContext.listEditModalPayload
  );
  const [joinModalOpen, setJoinModalOpen] = useState(
    defaultModalContext.joinModalOpen
  );
  const [joinModalPayload, setJoinModalPayload] = useState(
    defaultModalContext.joinModalPayload
  );
  const [routeCompleteModalOpen, setRouteCompleteModalOpen] = useState(
    defaultModalContext.routeCompleteModalOpen
  );
  const [routeCompleteModalPayload, setRouteCompleteModalPayload] = useState(
    defaultModalContext.routeCompleteModalPayload
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
        joinModalOpen,
        joinModalPayload,
        routeCompleteModalOpen,
        routeCompleteModalPayload,
        setProductModalOpen,
        setProductModalPayload,
        setListModalOpen,
        setListModalPayload,
        setListProductModalOpen,
        setListProductModalPayload,
        setListEditModalOpen,
        setListEditModalPayload,
        setJoinModalOpen,
        setJoinModalPayload,
        setRouteCompleteModalOpen,
        setRouteCompleteModalPayload,
      }}>
      {listEditModalOpen && <ListEditModal />}
      {listProductModalOpen && <ListProductModal />}
      {routeCompleteModalOpen && <RouteCompleteModal />}
      {productModalOpen && <ProductModal />}
      {listModalOpen && <ListModal />}
      {joinModalOpen && <JoinModal />}
      {children}
    </ModalContext.Provider>
  );
};
