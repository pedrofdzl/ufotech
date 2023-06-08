import React, { useContext, useState, useEffect } from 'react';

// UI
import { Button } from '../ui/Button';

// Stylesheets
import '../../stylesheets/Modals.css';

// Providers
import { ListContext } from '../../providers/ListProvider';
import { ModalContext } from '../../providers/ModalProvider';
import { UserInformationContext } from '../../providers/UserInformationProvider';

// Components
import { Modal } from './Modal';

export const ListModal = () => {
  const { getLists, createList } = useContext(ListContext);
  const { userInformation } = useContext(UserInformationContext);
  const { listModalPayload, setListModalOpen, setListModalPayload } =
    useContext(ModalContext);

  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

  useEffect(() => {
    if (listModalPayload.currentName?.length > 0) {
      setSubmitButtonActive(true);
    } else {
      setSubmitButtonActive(false);
    }
  }, [listModalPayload]);

  const submitHandler = () => {
    createList({
      name: listModalPayload.currentName,
      owner: userInformation.email,
      success: (lista) => {
        getLists();
        setListModalOpen(false);
        setSubmitButtonLoading(false);
      },
    });
  };

  return (
    <Modal setIsOpen={setListModalOpen} title={'Nueva lista'}>
      <input
        type='text'
        id='nombreLista'
        placeholder='Nombre'
        style={{ marginBottom: 0 }}
        onChange={(e) =>
          setListModalPayload({
            ...listModalPayload,
            currentName: e.target.value,
          })
        }
      />

      <Button
        variant={'add-large'}
        styles={{ marginTop: 16 }}
        disabled={!submitButtonActive}
        loading={submitButtonLoading}
        callbackFunction={() => {
          setSubmitButtonLoading(true);
          submitHandler();
        }}>
        Crear
      </Button>
    </Modal>
  );
};
