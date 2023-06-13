import React, { useContext, useState, useEffect } from 'react';

// UI
import { Button } from '../ui/Button';

// Stylesheets
import '../../stylesheets/Modals.css';

// Providers
import { ListContext } from '../../providers/ListProvider';
import { ModalContext } from '../../providers/ModalProvider';
import { NotificationContext } from '../../providers/NotificationProvider';

// Components
import { Modal } from './Modal';

export const ListEditModal = () => {
  const { getLists, resetMyLists, updateList, deleteList } =
    useContext(ListContext);
  const {
    listEditModalPayload,
    setListEditModalOpen,
    setListEditModalPayload,
  } = useContext(ModalContext);
  const { queueNotification } = useContext(NotificationContext);

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
    updateList({
      list: listEditModalPayload.currentList,
      name: listEditModalPayload.currentName,
      success: () => {
        getLists();
        setListEditModalOpen(false);
        setSubmitButtonLoading(false);
      },
    });
  };

  const deleteHandler = () => {
    deleteList({
      list: listEditModalPayload.currentList,
      success: () => {
        listEditModalPayload.onClose();
        resetMyLists();
        setListEditModalOpen(false);
        setSubmitButtonLoading(false);
      },
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
        <>
          {' '}
          <Button
            variant={'disabled'}
            styles={{ marginTop: 16, color: 'white', fontSize: 18 }}
            callbackFunction={() => {
              queueNotification({
                message: '¡Link de invitación copiado!',
                type: 'success',
              });
              navigator.clipboard.writeText(
                `https://heb-route.web.app/dashboard/?listInviteID=${listEditModalPayload.currentList}`
              );
            }}>
            Compartir lista
          </Button>
          <Button
            variant={'add-large'}
            styles={{ marginTop: 8 }}
            disabled={!submitButtonActive}
            loading={submitButtonLoading}
            callbackFunction={() => {
              setSubmitButtonLoading(true);
              submitHandler();
            }}>
            Actualizar
          </Button>
        </>
      )}
      {deleting ? (
        <Button
          variant={'secondary'}
          callbackFunction={() => setDeleting(false)}>
          Cancelar
        </Button>
      ) : (
        <Button
          variant={'secondary'}
          callbackFunction={() => setDeleting(true)}>
          Eliminar lista
        </Button>
      )}
    </Modal>
  );
};
