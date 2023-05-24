import React, { useContext, useState, useEffect } from 'react';

// UI
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

// Stylesheets
import '../../stylesheets/Modals.css';

// Providers
import { ListContext } from '../../providers/ListProvider';
import { ModalContext } from '../../providers/ModalProvider';
import { UserInformationContext } from '../../providers/UserInformationProvider';

// Components
import { Modal } from './Modal';

export const JoinModal = () => {
  const { joinList, fetchList } = useContext(ListContext);
  const { userInformation } = useContext(UserInformationContext);
  const { joinModalPayload, setJoinModalOpen, setJoinModalPayload } =
    useContext(ModalContext);

  const [listName, setListName] = useState('Lista');
  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

  useEffect(() => {
    const asyncFetchList = async () => {
      const auxListName = await fetchList(joinModalPayload.currentList);
      setListName(auxListName);
    };
    asyncFetchList();
  }, [joinModalPayload]);
  
  const submitHandler = () => {
    joinList({
      list: joinModalPayload.currentList,
      userEmail: userInformation.email,
      success: () => {
        setJoinModalOpen(false);
        setSubmitButtonLoading(false);
      },
    });
  };

  return (
    <Modal setIsOpen={setJoinModalOpen} title={'Unirse a lista'}>
      <Text variant={'b4'} styles={{ fontWeight: 300, marginTop: 0 }}>Has sido invitado a unirte a la lista: <span>"{listName}".</span></Text>

      <Button
        variant={'add-large'}
        styles={{ marginTop: 16 }}
        loading={submitButtonLoading}
        callbackFunction={() => {
          setSubmitButtonLoading(true);
          submitHandler();
        }}>
        Unirse
      </Button>
    </Modal>
  );
};
