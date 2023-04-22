import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Dashboard = () => {
  const { currentUser, providerLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    providerLogout();
    navigate('/');
  };

  return (
    <>
    {currentUser ?
      <div className="auth-container">
        <Text>Bienvenido de vuelta <span>{ currentUser.email }</span>!</Text>
        <Button callbackFunction={() => logout()}>Cerrar sesión</Button>
      </div> : <></>
    }
    </>
  );
};

export default Dashboard;