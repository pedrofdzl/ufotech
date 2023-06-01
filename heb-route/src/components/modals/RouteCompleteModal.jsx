import React, { useContext } from 'react';

// UI
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

// Stylesheets
import '../../stylesheets/Modals.css';

// Providers
import { ModalContext } from '../../providers/ModalProvider';

// Components
import { Modal } from './Modal';

export const RouteCompleteModal = () => {
  const { setRouteCompleteModalOpen, routeCompleteModalPayload } =
    useContext(ModalContext);

  const submitHandler = () => {
    routeCompleteModalPayload.onClose();
    setRouteCompleteModalOpen(false);
  };

  return (
    <Modal setIsOpen={submitHandler} title={'Fin de lista'}>
      <Text variant={'b4'} styles={{ fontWeight: 300, marginTop: 0 }}>¡Has recogido todos los productos de tu lista!</Text>
      <Button
        variant={'add-large'}
        styles={{ marginTop: 16 }}
        callbackFunction={() => {
          submitHandler();
        }}>
        Salir
      </Button>
    </Modal>
  );
};
