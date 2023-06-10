import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { db, storage } from '../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { UserInformationContext } from "../providers/UserInformationProvider";
import { ListContext } from "../providers/ListProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';
import '../stylesheets/Support.css';

// Default Image
import defaultProfileImage from '../assets/img/hebimage.png'

const Profile = () => {
  const { providerLogout } = useContext(AuthContext);
  const { lists } = useContext(ListContext);
  const { userInformation, getUserInformation } = useContext(UserInformationContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Forms Value
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLasttName] = useState('');

  const [profilePicFile, setProfilePicFile] = useState('');
  const [editProfilePic, setEditProfilePic] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');

  const [listCount, setListCount] = useState(0);
  const [sharedListCount, setSharedListCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const logout = () => {
    if (providerLogout()) {
      navigate('/');
    }
  };

  const editHandler = () => {
    setEditing(true);
  }

  const cancelHandler = () => {
    setFirstName(userInformation.firstName);
    setLasttName(userInformation.lastName)
    setEditing(false);
    setErrorMessage('');
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
      setErrorMessage('Se tienen que llenar todos los campos');
      return
    }

    if (firstName.length < 2) {
      setErrorMessage('El nombre debe tener mínimo 2 caracteres');
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
    });
  }
  
  const editProfilePicHandler = event =>{
    setEditProfilePic(true)
  }

  const cancelEditProfilePic = event => {
    setEditProfilePic(false);
    setErrorMessage('');
  }

  const fileChangeHandler = event => {
    setProfilePicFile(event.target.files[0]);
  }

  const submitProfilePicHandler = event => {
    event.preventDefault();
    setUploadingPic(true)

    if(!profilePicFile){
      setErrorMessage('No se encontró una imagen')
      return
    }

    const storageRef = ref(storage, `/files/${userInformation.email}/${profilePicFile.name}`);

    uploadBytes(storageRef, profilePicFile).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url)=>{
        const userDoc = doc(db, 'users', userInformation.email);
        updateDoc(userDoc, {
          profilepic: url,
        }).then((userSnapshot)=>{
          setEditProfilePic(false)
          setErrorMessage('')
          getUserInformation();
          setUploadingPic(false)
        })
      }).catch(err=>{
        console.log(err);
        setErrorMessage('No se pudo subir la imagen, inténtalo nuevamente')
        setUploadingPic(false)
      })
    });
  }

  useEffect(() => {
    if (!userInformation?.firstName) {
      getUserInformation();
    }
  }, []);

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
      {userInformation && !editing && !editProfilePic && <div style={{ width: 'calc(100vw - 32px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 64 }}>
          <div className='profile-picture'>
            {(userInformation.profilepic) ? 
              <img src={userInformation.profilepic} alt={'profile-pic'} onClick={editProfilePicHandler} />
              :
              <img src={defaultProfileImage} alt={'profile-pic'} onClick={editProfilePicHandler} />
            }
          </div>
          <Text variant="b2" onClick={editProfilePicHandler}>Cambiar foto de perfil</Text>
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

      {editProfilePic &&
        <div>
          <form onSubmit={submitProfilePicHandler}>
            {errorMessage && <h4 className='error-message'>{errorMessage}</h4>}
            <label htmlFor="">Imagen de perfil</label>
            <input type="file" onChange={fileChangeHandler} accept="/image/*" />
            <Button type="submit" variant={'primary'} disabled={uploadingPic} loading={uploadingPic}>Guardar</Button>
            <Button variant="secondary" callbackFunction={cancelEditProfilePic}>Cancelar</Button>
          </form>
        </div>
      }

      {editing &&
        <>
          <div className='view-header'>
            <Text variant={'h2'}>Editar perfil</Text>
          </div>
          <form onSubmit={submitHandler}>
            {errorMessage && <h4 className='error-message'>{errorMessage}</h4>}
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