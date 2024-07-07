import React, {createContext, useState, useEffect} from 'react';
import {isLoggedIn} from '../auth/auth.service';

export const UserContext = createContext(null);

export const UserProvider = props => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [updateRevenu, setUpdateRevenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      let value = await isLoggedIn();
      setLoggedIn(value);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    modalOpen ? console.log('Modal Opened') : console.log('Modal Closed');
  }, [modalOpen]);

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        updateRevenu,
        setUpdateRevenu,
        modalOpen,
        setModalOpen,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};
