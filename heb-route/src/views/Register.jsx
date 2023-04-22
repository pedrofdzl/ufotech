import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Auth.css';

const Register = () => {
  const { providerRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitRegistration = (e) => {
      e.preventDefault();
      let name = e.target.elements.nameField.value;
      let email = e.target.elements.emailField.value;
      let password = e.target.elements.passwordField.value;
      let repPassword = e.target.elements.repPasswordField.value;
      providerRegister(name, email, password, repPassword);
  };

  return (
    <div className="auth-container">
      <Text variant={'h1'}>Regístrate</Text>
      <form onSubmit={submitRegistration}>
        <div className="auth-form-fields">
         <label htmlFor="nameField"> Nombre </label>
         <input type="name" id="nameField"/>
         <label htmlFor="emailField"> Correo electrónico </label>
         <input type="email" id="emailField"/>              
         <label htmlFor="passwordField"> Contraseña </label>
         <input type="password" id="passwordField"/>
         <label htmlFor="repPasswordField"> Repetir contraseña </label>
         <input type="password" id="repPasswordField"/>
        </div>
        <div className="auth-buttons">
          <Button type="submit">Registrarse</Button>
          <Button variant={'secondary'} callbackFunction={() => navigate('/login')}>¿Ya tienes cuenta? Inicia sesión</Button>
        </div>
      </form>
    </div>
  );
};

export default Register;