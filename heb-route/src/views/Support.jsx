import React, {useState, useContext} from "react";

// Providers
import { UserInformationContext } from "../providers/UserInformationProvider";

// Stylesheets
import '../stylesheets/Button.css';

const Support = () => {
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { userInformation } = useContext(UserInformationContext);

  const submitHandler = async(Event) => {
    Event.preventDefault();

    if(!contenido || !asunto ){
      setError(true);
      return
    } else {
      setEnviado(true);
      return
    }

    const payload = {
      asunto: asunto, texto:contenido,
      user:{
        nombre: userInformation.firstName, 
        apellido: userInformation.lastName,
        correo: userInformation.email
      }
    }

    const response = await fetch("https://createsupportticket-4fwjrlkifa-uc.a.run.app", {
      method:'POST',
      body: JSON.stringify (payload),
      headers: {"Content-Type":"application/json"}
    });

    if(response.ok){
      console.log("yipeee")
    }else{
      setError(true);
      console.log("Algo salió mal")
    }

  }

  const asuntoHandler = (event) => {
    setAsunto(event.target.value);
  }

  const contenidoHandler = (event) => {
    setContenido(event.target.value);
  }





 return <>
  <h1>Support</h1>
  {error && <h4>Algo salió mal, verifica que la información sea correcta.</h4>}
  {enviado && <h4>El formulario se envió correctamente.</h4>}


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

export default Support;