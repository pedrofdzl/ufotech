import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Providers
import { AuthContext } from "../providers/AuthProvider";

// Components
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

// Stylesheets
import '../stylesheets/Dashboard.css';

const Lists = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
    {currentUser && <>
        <Text>Listas</Text>
    </>}
    </>
  );
};

export default Lists;