import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import HeaderNavitagion from '../navigators/HeaderNavigation';

import { Button } from '../components/ui/Button';

const Support = () =>{
  const navigate = useNavigate();
  const location = useLocation();

  return <>
    <HeaderNavitagion/>
    <h1>Soporte</h1>

    <Button callbackFunction={() => navigate('/support-tickets', {state : {prev: location.pathname}})}>Ver Mis Tickets</Button>
    <Button callbackFunction={() => navigate('/support-ticket', {state: { prev: location.pathname }})}>Crear Ticket</Button>
  </>
}

export default Support