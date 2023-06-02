import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Providers
import { SupportContext } from "../providers/SupportProvider";

// Components
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Icons
import { AiOutlinePlus } from 'react-icons/ai';

// Stylesheets
import '../stylesheets/Lists.css';
import '../stylesheets/Support.css';

const Support = () => {
  const { tickets } = useContext(SupportContext);
  const navigate = useNavigate();
  const location = useLocation();

  const formattedDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate().toString()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
  };

  return <>
    <HeaderNavitagion />
    <div className='safe-area'>
      <div className='view-header' style={{ paddingTop: 8 }} >
        <Text variant={'h2'}>Tickets de soporte</Text>
      </div>
      <Button variant='add-list' callbackFunction={() => navigate('/support-ticket', { state: { prev: location.pathname } })}>
        <div className='list-new'>
          <Text
            styles={{
              fontSize: 16,
              margin: 0,
              color: 'var(--gray)',
              fontWeight: 400,
            }}>
            Crear ticket
          </Text>
          <AiOutlinePlus style={{ fontSize: 18 }} />
        </div>
      </Button>
      {(tickets.supportTickets.length > 0 ? tickets.supportTickets.map(ticket => {
        return <div className='list-ticket' key={ticket.id}>
          <div>
            <Text variant='b44'>{ticket.asunto}</Text>
            <Text variant='b3'>Creado el {formattedDate(ticket.fecha)}</Text>
          </div>
          <Text variant='b3'>{ticket.estatus}</Text>
        </div>
      }) : <Text>¡No tienes Tickets Asignados!</Text>)}
    </div>
  </>
}

export default Support