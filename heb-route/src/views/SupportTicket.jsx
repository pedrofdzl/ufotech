import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Providers
import { SupportContext } from "../providers/SupportProvider";
import { NotificationContext } from '../providers/NotificationProvider';

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Support.css';

// Navigation
import HeaderNavigation from '../navigators/HeaderNavigation';

const SupportTicket = () => {
  const [uploading, setUploading] = useState(false);
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { createSupportTicket } = useContext(SupportContext)
  const { queueNotification } = useContext(NotificationContext)


  useEffect(() => {
    setError(false)
    setErrorMessage('')
    setAsunto('')
    setContenido('')
  }, []);

  const submitHandler = async (Event) => {
    Event.preventDefault();
    setUploading(true);

    if (!contenido || !asunto) {
      setError(true);
      setUploading(false);
      return
    }

    const errorState = await createSupportTicket(asunto, contenido);

    if (errorState.error) {
      setError(errorState.error)
      setErrorMessage(errorState.errorMessage)
      setUploading(false);
      return
    }

    setUploading(false);
    setError(false)
    setErrorMessage('')
    setAsunto('')
    setContenido('')
    queueNotification({message: 'Se ha enviado el ticket con éxito', type: 'success'})
    navigate('/support', { replace: true })
  }

  const asuntoHandler = (event) => {
    setAsunto(event.target.value);
  }

  const contenidoHandler = (event) => {
    setContenido(event.target.value);
  }

  return <>
    <HeaderNavigation />
    <div className="safe-area">
      <div className='view-header' style={{ paddingTop: 8 }} >
        <Text variant={'h2'}>Crear tickets</Text>
      </div>
      {error && (errorMessage.length > 0 ? <h4 className='error-message'>{errorMessage}</h4> : <h4 className='error-message'>Algo salió mal, verifica que la información sea correcta</h4>)}


      <form onSubmit={submitHandler}>
        <label>Asunto</label>
        <div>
          <input type='text' name='asunto' id='asunto' value={asunto} onChange={asuntoHandler} />
        </div>

        <label>Contenido</label>
        <div>
          <textarea type='text' name='contenido' id='contenido' value={contenido} onChange={contenidoHandler} > </textarea>
        </div>

        <Button type='submit' className="btn" styles={{ marginTop: 16 }} disabled={uploading} loading={uploading}>Enviar</Button>
      </form>
    </div>
  </>
}

export default SupportTicket;