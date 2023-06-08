import React, { useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Auth.css';

// Assets
import authImage from '../assets/img/auth.png';

const Auth = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, []);

  return (
    <div className="auth-container">
      <Text>Ahorrar <span>tiempo</span> es ahorrar <span>dinero</span>.</Text>
      <div className="auth-image">
        <img src={authImage}/>
      </div>
      <div className="auth-buttons">
        <Button variant={'primary'} callbackFunction={() => navigate('/login')}>Iniciar sesión</Button>
        <Button variant={'secondary'} callbackFunction={() => navigate('/register')}>Crear cuenta</Button>
      </div>
    </div>
  );
};

export default Auth;