import React, {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";

// Providers
import { SupportContext } from "../providers/SupportProvider";

// Stylesheets
import '../stylesheets/Button.css';

// Navigation
import HeaderNavigation from '../navigators/HeaderNavigation';

const SupportTicket = () => {
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { createSupportTicket } = useContext(SupportContext)

  const submitHandler = async(Event) => {
    Event.preventDefault();

    if(!contenido || !asunto ){
      setError(true);
      return
    }
    
   const errorState = await createSupportTicket(asunto, contenido);

   if (errorState.error) {
    setError(errorState.error)
    setErrorMessage(errorState.errorMessage)
    return
   }

   setError(false)
   setErrorMessage('')
   navigate('/support',{replace: true})
  }

  const asuntoHandler = (event) => {
    setAsunto(event.target.value);
  }

  const contenidoHandler = (event) => {
    setContenido(event.target.value);
  }

 return <>
  
  <HeaderNavigation/>
  <h1>Support</h1>
  {error && errorMessage.length > 0 ? <h4>{errorMessage}</h4>: <h4>Algo salió mal, verifica que la información sea correcta.</h4>}


  <form onSubmit={submitHandler}>
    <label>Asunto</label>
    <div>
      <input type='text' name='asunto' id='asunto' value={asunto} onChange={asuntoHandler}/>
    </div>

    <label>Contenido</label>
    <div>
      <textarea type='text' name='contenido' id='contenido' value={contenido} onChange={contenidoHandler} > </textarea>
    </div>

    <button type='submit' className="btn" >Enviar</button>
  </form>
 </>
}

export default SupportTicket;