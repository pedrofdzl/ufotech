import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Auth.css';
import '../stylesheets/Support.css';

const Login = () => {
  const { providerLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ errorMessage, setErrorMessage ] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailHandler = event=>{
    setEmail(event.target.value);
  }

  const passwordHandler = event=>{
    setPassword(event.target.value)
  }


  const submitLogin = async() => {

    if (!(email.length > 0) || !(password.length > 0)){
      setErrorMessage('Favor de llenar todos los campos');
      return
    }

    const isValid = await providerLogin(email, password);
    console.log(isValid);
    if(!isValid){
      setErrorMessage('El Correo o Contraseña es incorrecto')
    }
  };

  return (
    <div className="auth-container">
      <Text variant={'h1'}>¡Bienvenido de vuelta!</Text>
      <form onSubmit={submitLogin}>
        {errorMessage && <h4 className='error-message'>{errorMessage}</h4>}
        <div className="auth-form-fields">
          <label htmlFor="emailField"> Correo electrónico </label>
          <input type="email" id="emailField" onChange={emailHandler} />          
          <label htmlFor="passwordField"> Contraseña </label>
          <input type="password" id="passwordField" onChange={passwordHandler} />
        </div>
        <div className="auth-buttons">
          <Button callbackFunction={() => submitLogin()}> Iniciar Sesión </Button>
          <Button variant={'secondary'} callbackFunction={() => navigate('/register')}><Text variant={'b4'} styles={{ margin: 0 }}>¿No tienes cuenta? <span>Regístrate</span></Text></Button>
        </div>
      </form>
    </div>
  );
};

export default Login;