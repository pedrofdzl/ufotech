import React from 'react';

// UI
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';

// Stylesheets
import '../../stylesheets/Modals.css';

// Icons
import { AiOutlineClose } from 'react-icons/ai';

export const Modal = ({ setIsOpen, title, children }) => {
  return (
    <>
      <div onClick={() => setIsOpen(false)} className='modal-background'></div>
      <div className='modal'>
        <div className='modal-header'>
          <Text variant={'h3'}>{title}</Text>
          <Button variant={'close'} callbackFunction={() => setIsOpen(false)}>
            <AiOutlineClose />
          </Button>
        </div>
        {children}
      </div>
    </>
  );
};
