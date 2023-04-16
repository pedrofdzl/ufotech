import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Functions
import { login } from "../functions/auth";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Auth.css';

const Login = () => {
  const { setCurrentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, []);

  const submitLogin = (e) => {
    e.preventDefault();
    let email = e.target.elements.emailField.value;
    let password = e.target.elements.passwordField.value;
    login(email, password, setCurrentUser, navigate);
  };

  return (
    <div className="auth-container">
      <Text variant={'h1'}>¡Bienvenido de vuelta!</Text>
      <form onSubmit={submitLogin}>
        <div className="auth-form-fields">
          <label htmlFor="emailField"> Correo electrónico </label>
          <input type="email" id="emailField"/>          
          <label htmlFor="passwordField"> Contraseña </label>
          <input type="password" id="passwordField"/>
        </div>
        <div className="auth-buttons">
          <Button type="submit"> Iniciar sesión </Button>
          <Button variant={'secondary'} callbackFunction={() => navigate('/register')}>¿No tienes cuenta? Regístrate</Button>
        </div>
      </form>
    </div>
  );
};

export default Login;