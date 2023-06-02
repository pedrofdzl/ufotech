import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { UserInformationContext } from "../providers/UserInformationProvider";
import { SupportContext } from "../providers/SupportProvider";
import { ListContext } from "../providers/ListProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Profile = () => {
  const { providerLogout } = useContext(AuthContext);
  const { lists, clearLists } = useContext(ListContext);
  const { userInformation, getUserInformation, clearUserInformation } = useContext(UserInformationContext);
  const { clearSupportTickets } = useContext(SupportContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLasttName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [listCount, setListCount] = useState(0);
  const [sharedListCount, setSharedListCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const logout = () => {
    clearUserInformation();
    clearSupportTickets();
    clearLists();
    providerLogout();
    navigate('/');
  };

  const editHandler = () => {
    setEditing(true);
  }

  const cancelHandler = () => {
    setFirstName(userInformation.firstName);
    setLasttName(userInformation.lastName)
    setEditing(false);
  }

  const firstNameHandler = event => {
    setFirstName(event.target.value)
  }
  const LastNameHandler = event => {
    setLasttName(event.target.value)
  }

  const submitHandler = event => {
    event.preventDefault();

    if (!(firstName.length > 0) || !(lastName.length > 0)) {
      setErrorMessage('Se tienen que llenar todos los campos!');
      return
    }

    if (firstName.length < 3) {
      setErrorMessage('El nombre debe tener minimo 3 caracteres');
      return
    }


    const userDoc = doc(db, 'users', userInformation.email);
    updateDoc(userDoc, {
      name: firstName,
      lastname: lastName
    }).then(() => {
      setEditing(false);
      getUserInformation();
      setErrorMessage('')
    })

  }

  useEffect(() => {
    setFirstName(userInformation.firstName);
    setLasttName(userInformation.lastName)

    let auxListCount = 0;
    let auxSharedListCount = 0;
    let auxProductsCount = 0;

    const listKeys = Object.keys(lists.myLists);
    listKeys.forEach((list) => {
      if (lists.myLists[list].type === "shared") {
        auxSharedListCount++;
      } else {
        auxListCount++;
      }
      Object.keys(lists.myLists[list].products).forEach((product) => {
        if (lists.myLists[list].products[product]?.addedBy === userInformation.email || !lists.myLists[list].products[product]?.addedBy) {
          auxProductsCount++;
        }
      });
    });

    setListCount(auxListCount);
    setSharedListCount(auxSharedListCount);
    setProductCount(auxProductsCount);

  }, [userInformation.firstName, userInformation.lastName]);

  return (

    <>
      {userInformation && !editing && <div style={{ width: 'calc(100vw - 32px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 64 }}>
          <div className='profile-picture'>
            <img src='https://media.newyorker.com/photos/5ba177da9eb2f7420aadeb98/1:1/w_1003,h_1003,c_limit/Cohen-Linus-Torvalds.jpg' alt={'profile-pic'} />
          </div>
          <Text variant={'h2'} styles={{ fontSize: 24, marginBottom: 0, marginTop: 24 }}>{userInformation.firstName} {userInformation.lastName}</Text>
          <Text variant={'b2'} styles={{ margin: 0, fontWeight: 300 }}>{userInformation.email}</Text>
        </div>

        <div className="user-data-chips">
          <div className="user-data-chip">
            <Text styles={{ fontSize: 26, fontWeight: 500 }}>{listCount}</Text>
            <Text variant={'b3'} styles={{ margin: 0 }}>Listas individuales</Text>
          </div>
          <div className="user-data-chip">
            <Text styles={{ fontSize: 26, fontWeight: 500 }}>{sharedListCount}</Text>
            <Text variant={'b3'} styles={{ margin: 0 }}>Listas compartidas</Text>
          </div>
          <div className="user-data-chip">
            <Text styles={{ fontSize: 26, fontWeight: 500 }}>{productCount}</Text>
            <Text variant={'b3'} styles={{ margin: 0 }}>Productos agregados</Text>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Button callbackFunction={editHandler}>Editar perfil</Button>
            <Button callbackFunction={() => { navigate('/support', { state: { prev: location.pathname, search: location.search } }) }}>Soporte</Button>
          </div>
          <Button variant={'secondary'} callbackFunction={() => logout()}>Cerrar sesión</Button>
        </div>
      </div>
      }


      {editing &&
        <>
          <div className='view-header'>
            <Text variant={'h2'}>Editar perfil</Text>
          </div>
          <form onSubmit={submitHandler}>
            {errorMessage && <h4>{errorMessage}</h4>}
            <label htmlFor="">Nombre</label>
            <input onChange={firstNameHandler} type="text" value={firstName} />
            <label htmlFor="">Apellido</label>
            <input onChange={LastNameHandler} type="text" value={lastName} />
            <input className="btn btn-primary" type="submit" value={'Guardar'} />
            <Button variant={'secondary'} callbackFunction={cancelHandler}>Cancelar</Button>
          </form>
        </>}
    </>
  );
};

export default Profile;