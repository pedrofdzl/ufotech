import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { NotificationContext } from '../providers/NotificationProvider';

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Auth.css';
import '../stylesheets/Support.css';

const Register = () => {
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  const { providerRegister } = useContext(AuthContext);
  const { queueNotification } = useContext(NotificationContext)
  const navigate = useNavigate();

  const successHandler = () =>{
    setError(false)
    setMessage('')
    queueNotification({message: '¡Usuario creado exitosamente!', type: 'success'})
  }

  const submitRegistration = async(e) => {
      e.preventDefault();
      let name = e.target.elements.nameField.value;
      let lastname = e.target.elements.lastnameField.value;
      let email = e.target.elements.emailField.value;
      let password = e.target.elements.passwordField.value;
      let repPassword = e.target.elements.repPasswordField.value;

      const errorState = await providerRegister(name, lastname, email, password, repPassword, successHandler);
      if (errorState.error){
        setError(true)
        setMessage(errorState.message)
      }
  };

  return (
    <div className="auth-container">
      <Text variant={'h1'}>Regístrate</Text>
      <form onSubmit={submitRegistration}>
      {error && <h4 className='error-message'>{message}</h4>}

        <div className="auth-form-fields">
         <label htmlFor="nameField"> Nombre </label>
         <input type="name" id="nameField"/>
         <label htmlFor="lastnameField"> Apellido </label>
         <input type="lastname" id="lastnameField"/>
         <label htmlFor="emailField"> Correo electrónico </label>
         <input type="email" id="emailField"/>              
         <label htmlFor="passwordField"> Contraseña </label>
         <input type="password" id="passwordField"/>
         <label htmlFor="repPasswordField"> Repetir contraseña </label>
         <input type="password" id="repPasswordField"/>
        </div>
        <div className="auth-buttons">
          <Button type="submit">Registrarse</Button>
          <Button variant={'secondary'} callbackFunction={() => navigate('/login')}><Text variant={'b4'} styles={{ margin: 0 }}>¿Ya tienes cuenta? <span>Inicia sesión</span></Text></Button>
        </div>
      </form>
    </div>
  );
};

export default Register;