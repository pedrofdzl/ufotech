import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { db } from "../firebase/firebase";
import { addDoc, collection, where, query, getDocs, } from "firebase/firestore";

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { UserInformationContext } from '../providers/UserInformationProvider';

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Lists = () => {
  const { currentUser } = useContext(AuthContext);
  const  { userInformation } = useContext(UserInformationContext) 

  const [nombreLista, setNombreLista] = useState('');
  const [agregandoLista, setAgregandoLista] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [myListas, setMyListas] = useState([]);
  const [myListasJSX, setmyListasJSX] = useState();
  
  const navigate = useNavigate();

  const nombreListaHandler = event =>{
    setNombreLista(event.target.value)
  }

  const submitHandler = event => {
    event.preventDefault();

    if (!(nombreLista.length > 0)){
      setErrorMessage('¡Debes llenar todos los campos!');
      return
    }

    const listasCollection = collection(db, 'Listas');
    addDoc(listasCollection,{
      'Nombre': nombreLista,
      'Owner': userInformation.email
    }).then(lista=>{
      console.log(lista.id)
      setNombreLista('');
      setAgregandoLista(false)
    });
  }

  const getMyListas = () =>{
    const listasCollection = collection(db, 'Listas');
    const listasQuery = query(listasCollection, where('Owner', '==', userInformation.email));
    getDocs(listasQuery).then(listasDocs=>{

      let lcList = [];
      listasDocs.forEach(lista=>{
        // console.log(lista.id)
        lcList.push({ id:lista.id, ...lista.data() });
      });
      setMyListas(lcList);
    });
  }

  useEffect(()=>{
    getMyListas();
  }, []);

  

  useEffect(()=>{
    const listsJSXmap = myListas.map(lista=>{
      console.log(lista.Nombre)
      return <div key={lista.id}>
        <h4>{lista.Nombre}</h4>
      </div>
    });
     setmyListasJSX(<div>
        {listsJSXmap}
      </div>)
  },[myListas])
  


  return (
    <>
    {currentUser && <>
        <Text>Listas</Text>
        <Button callbackFunction={()=>setAgregandoLista(true)}>Agregar Lista</Button>

        {!agregandoLista && myListasJSX }

        {agregandoLista && 
          <form onSubmit={submitHandler}>
            { errorMessage && <h4>{errorMessage}</h4> }
            <label htmlFor="">Nombre</label>
            <input type="text" id="nombreLista" onChange={nombreListaHandler} />
            <Button callbackFunction={()=>setAgregandoLista(false) }>Cancelar</Button>
            <input type="submit" value={'Agregar'}/>
          </form>
        }

    </>}
    </>
  );
};

export default Lists;