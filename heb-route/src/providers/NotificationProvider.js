import React, { useState, useEffect } from 'react';

// Stylesheets
import '../stylesheets/Modals.css';

// UI
import { Text } from '../components/ui/Text';

// Icons
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineWarning } from 'react-icons/ai';

// Utils
import { delay } from '../utils/utils';

const defaultNotificationContext = {
  queueNotification: () => {},
};

export const NotificationContext = React.createContext(
  defaultNotificationContext
);

export const NotificationProvider = ({ children }) => {
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState({});
  const [isDisplayingNotification, setIsDisplayingNotification] =
    useState(false);

  useEffect(() => {
    if (notificationQueue.length > 0) {
      setCurrentNotification({
        message: notificationQueue[0].message,
        type: notificationQueue[0].type,
      });
      displayNotification();
      setIsDisplayingNotification(true);
    }
  }, [notificationQueue]);

  const displayNotification = async () => {
    await delay(2000);
    setIsDisplayingNotification(false);
    let auxQueue = notificationQueue;
    auxQueue.shift();
    setNotificationQueue(auxQueue);
  };

  const queueNotification = ({ message, type }) => {
    const auxNotification = { message: message, type: type };
    setNotificationQueue((prevQueue) => [...prevQueue, auxNotification]);
  };

  const NotificationContainer = () => {
    return (
      <div className='notification-container'>
        <div className={`notification not-${currentNotification?.type}`}>
          {(currentNotification?.type === 'success' ||
            currentNotification?.type === 'success-variant') && (
            <BsCheckLg style={{ fontSize: 18 }} />
          )}
          {currentNotification?.type === 'warning' && (
            <AiOutlineWarning style={{ fontSize: 18 }} />
          )}
          <Text variant={'b2'}>{currentNotification?.message}</Text>
        </div>
      </div>
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        queueNotification,
      }}>
      {isDisplayingNotification && <NotificationContainer />}
      {children}
    </NotificationContext.Provider>
  );
};
