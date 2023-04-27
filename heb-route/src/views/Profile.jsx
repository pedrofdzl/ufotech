import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";
import { UserInformationContext } from "../providers/UserInformationProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Profile = () => {
  const { providerLogout } = useContext(AuthContext);
  const { userInformation } = useContext(UserInformationContext);
  const navigate = useNavigate();

  const logout = () => {
    providerLogout();
    navigate('/');
  };

  return (
    <>
    {userInformation && <>
        <Text>{userInformation.firstName} {userInformation.lastName}</Text>
        <Button callbackFunction={() => logout()}>Cerrar sesión</Button>    
    </>}
    </>
  );
};

export default Profile;