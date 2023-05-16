import React, { useContext, useState, useEffect } from 'react';

// UI
import { Button } from '../ui/Button';

// Stylesheets
import '../../stylesheets/Modals.css';

// Providers
import { ListContext } from '../../providers/ListProvider';
import { ModalContext } from '../../providers/ModalProvider';

// Components
import { Modal } from './Modal';

// Database
import { db } from '../../firebase/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const ListEditModal = () => {
  const { getMyLists, resetMyLists } = useContext(ListContext);
  const {
    listEditModalPayload,
    setListEditModalOpen,
    setListEditModalPayload,
  } = useContext(ModalContext);

  const [deleting, setDeleting] = useState(false);

  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

  useEffect(() => {
    if (listEditModalPayload.currentName?.length > 0) {
      setSubmitButtonActive(true);
    } else {
      setSubmitButtonActive(false);
    }
  }, [listEditModalPayload]);

  const submitHandler = () => {
    const listReference = doc(db, 'Listas', listEditModalPayload.currentList);
    updateDoc(listReference, {
      Nombre: listEditModalPayload.currentName,
    }).then(() => {
      getMyLists();
      setListEditModalOpen(false);
      setSubmitButtonLoading(false);
    });
  };

  const deleteHandler = () => {
    const listReference = doc(db, 'Listas', listEditModalPayload.currentList);
    deleteDoc(listReference).then(() => {
      // nav back
      resetMyLists();
      setListEditModalOpen(false);
      setSubmitButtonLoading(false);
    });
  };

  return (
    <Modal setIsOpen={setListEditModalOpen} title={'Editar lista'}>
      <input
        type='text'
        id='nombreLista'
        placeholder='Nombre'
        style={{ marginBottom: 0 }}
        onChange={(e) =>
          setListEditModalPayload({
            ...listEditModalPayload,
            currentName: e.target.value,
          })
        }
        value={listEditModalPayload.currentName}
      />
      {deleting ? (
        <Button
          variant={'remove-large'}
          styles={{ marginTop: 16 }}
          disabled={!submitButtonActive}
          loading={submitButtonLoading}
          callbackFunction={() => {
            setSubmitButtonLoading(true);
            deleteHandler();
          }}>
          Confirmar eliminación
        </Button>
      ) : (
        <Button
          variant={'add-large'}
          styles={{ marginTop: 16 }}
          disabled={!submitButtonActive}
          loading={submitButtonLoading}
          callbackFunction={() => {
            setSubmitButtonLoading(true);
            submitHandler();
          }}>
          Actualizar
        </Button>
      )}
      {deleting ? (
        <Button variant={'secondary'} callbackFunction={() => setDeleting(false)}>Cancelar</Button>
      ) : (
        <Button variant={'secondary'} callbackFunction={() => setDeleting(true)}>Eliminar lista</Button>
      )}
    </Modal>
  );
};
