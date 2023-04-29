import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import {doc, updateDoc } from  'firebase/firestore';

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { UserInformationContext } from "../providers/UserInformationProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Profile = () => {
  const { providerLogout } = useContext(AuthContext);
  const { userInformation, getUserInformation } = useContext(UserInformationContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLasttName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const logout = () => {
    providerLogout();
    navigate('/');
  };

  const editHandler = ()=>{
    setEditing(true);
  }

  const cancelHandler = ()=>{
    setFirstName(userInformation.firstName);
    setLasttName(userInformation.lastName)
    setEditing(false);
  }

  const firstNameHandler = event =>{
    setFirstName(event.target.value)
  }
  const LastNameHandler = event =>{
    setLasttName(event.target.value)
  }

  const submitHandler = event=>{
    event.preventDefault();

    if (!(firstName.length > 0) || !(lastName.length > 0)){
      setErrorMessage('Se tienen que llenar todos los campos!');
      return
    }

    if (firstName.length < 3){
      setErrorMessage('El nombre debe tener minimo 3 caracteres');
      return
    }


    const userDoc = doc(db, 'users', userInformation.email);
    updateDoc(userDoc,{
      name: firstName,
      lastname: lastName
    }).then(()=>{
      setEditing(false);
      getUserInformation();
      setErrorMessage('')
    })
    
  }

  useEffect(()=>{
    setFirstName(userInformation.firstName);
    setLasttName(userInformation.lastName)
  }, [userInformation.firstName, userInformation.lastName])

  return (

    <>
      {userInformation && <>
          <Text>Perfil</Text>
          <Text variant={'h3'}>Bienvenido de vuelta, <span>{userInformation.firstName} {userInformation.lastName}</span>.</Text>
          {/* <Text>{userInformation.email}</Text> */}
          <br></br>
          {!editing && <>
          <br></br>
          <label htmlFor="">Nombre</label>
          <input type="text" value={firstName} readOnly/>
          <label htmlFor="">Apellido</label>
          <input type="text" value={lastName} readOnly/>

          <Button callbackFunction={editHandler}>Editar</Button>
        
          <Button variant={'secondary'} callbackFunction={() => logout()}>Cerrar sesión</Button>    
          </>}
      </>
      }
      

      {editing && 
      <form onSubmit={submitHandler}>
        {errorMessage && <h4>{errorMessage}</h4>}
        <label htmlFor="">Nombre</label>
        <input onChange={firstNameHandler} type="text" value={firstName} />
        <label htmlFor="">Apellido</label>
        <input onChange={LastNameHandler} type="text" value={lastName} />
        <input className="btn btn-primary" type="submit" value={'Guardar'} />
        <Button variant={'secondary'} callbackFunction={cancelHandler}>Cancelar</Button>
      </form>}     
      
    </>
  );
};

export default Profile;