import React, { useState, useContext, useEffect } from "react";

// Providers
import { SupportContext } from "../providers/SupportProvider";

// Stylesheets
import "../stylesheets/Button.css";
import HeaderNavitagion from "../navigators/HeaderNavigation";


const SupportTickets = () => {
  const { tickets } = useContext(SupportContext)

      return (
    <>
    <HeaderNavitagion/>
      <h1>Support tickets</h1>
      
        {tickets.supportTickets.map(ticket=>{
          return <div key={ticket.id}>
            <div>
              <h4>Asunto: {ticket.asunto}</h4>
              <h4>Estatus: {ticket.estatus}</h4> 
              <small>Fecha: {ticket.fecha}</small>
            </div>
            <hr/>
          </div> 
        })}
    </>
  );
};

export default SupportTickets;
