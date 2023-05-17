import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { db } from "../firebase/firebase";
import { Timestamp, addDoc, collection, } from "firebase/firestore";

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { UserInformationContext } from '../providers/UserInformationProvider';
import { ListContext } from "../providers/ListProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Lists = () => {
  const { currentUser } = useContext(AuthContext);
  const  { userInformation } = useContext(UserInformationContext);
  const { lists, getMyLists } = useContext(ListContext);

  const [nombreLista, setNombreLista] = useState('');
  const [agregandoLista, setAgregandoLista] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const nombreListaHandler = event =>{
    setNombreLista(event.target.value)
  }

  const resetFormHandler = agregar =>{
    setErrorMessage('');
    setNombreLista('');
    setAgregandoLista(agregar);
  }

  const submitHandler = event => {
    event.preventDefault();

    if (!(nombreLista.length > 0)){
      setErrorMessage('¡Debes llenar todos los campos!');
      return
    }

    const listasCollection = collection(db, 'Listas');
    const date = new Date();
    addDoc(listasCollection,{
      'Nombre': nombreLista,
      'Owner': userInformation.email,
      'CreatedDate': date
    }).then(lista=>{
      resetFormHandler(false);
      getMyLists();
    });
  }

  return (
    <>
    {currentUser && <>
        <Text>Listas</Text>

        {!agregandoLista &&  Object.keys(lists.myLists).map(lista=>{
            return <div key={lista}>
              <Link to={`/lists/${lista}`} state={{prev: location.pathname, search: location.search}}>
                <h4>{lists.myLists[lista].name}</h4>
              </Link>
            </div>
          })
        }

        {agregandoLista ?
          <form onSubmit={submitHandler}>
            { errorMessage && <h4>{errorMessage}</h4> }
            <label htmlFor="">Nombre</label>
            <input type="text" id="nombreLista" onChange={nombreListaHandler} value={nombreLista} />
            <input className="btn btn-primary" type="submit" value={'Agregar'}/>
            <Button variant={'secondary'} callbackFunction={()=>resetFormHandler(false)}>Cancelar</Button>
          </form>
          :
          <Button callbackFunction={()=>setAgregandoLista(true)}>Agregar Lista</Button>
        }

    </>}
    </>
  );
};

export default Lists;