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
    {!editing && <>
      {userInformation && <>

          <Text>{userInformation.firstName} {userInformation.lastName}</Text>
          <Text>{userInformation.email}</Text>

          <Button callbackFunction={editHandler}>Editar</Button>


          <Button callbackFunction={() => logout()}>Cerrar sesión</Button>    
      </>}
      </>
      }
      

      {editing && 
      <form onSubmit={submitHandler}>
        {errorMessage && <h4>{errorMessage}</h4>}
        <label htmlFor="">Nombre:</label>
        <input onChange={firstNameHandler} type="text" value={firstName} />
        <label htmlFor="">Apellido:</label>
        <input onChange={LastNameHandler} type="text" value={lastName} />
        <Button callbackFunction={cancelHandler}>Cancelar</Button>
        <input type="submit" value={'Guardar'} />
      </form>}     
      
    </>
  );
};

export default Profile;