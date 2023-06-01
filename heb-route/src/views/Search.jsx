import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Auth.css';

const Login = () => {
  const { providerLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ errorMessage, setErrorMessage ] = useState('');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');

  const topicHandler = event=>{
    setTopic(event.target.value);
  }

  const detailsHandler = event=>{
    setDetails(event.target.value)
  }


  const submitLogin = async() => {

    if (!(topic.length > 0) || !(details.length > 0)){
      setErrorMessage('Favor de llenar todos los campos');
      return
    }
  };

  return (
    <div className="auth-container">
      <Text variant={'h1'}>¡Bienvenido de vuelta!</Text>
      <form onSubmit={submitLogin}>
        {errorMessage && <h4>{errorMessage}</h4>}
        <div className="auth-form-fields">
          <label htmlFor="emailField"> Correo electrónico </label>
          <input type="email" id="emailField" onChange={topicHandler} />          
          <label htmlFor="passwordField"> Contraseña </label>
          <input type="password" id="passwordField" onChange={detailsHandler} />
        </div>
        <div className="auth-buttons">
          <Button callbackFunction={() => submitLogin()}> Enviar </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;