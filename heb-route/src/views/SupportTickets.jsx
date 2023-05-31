import React, { useState, useContext } from "react";

// Providers
import { UserInformationContext } from "../providers/UserInformationProvider";

// Stylesheets
import "../stylesheets/Button.css";

const Support = () => {
  const [asunto, setAsunto] = useState("");
  const [contenido, setContenido] = useState("");
  const { userInformation } = useContext(UserInformationContext);

  const submitHandler = async (Event) => {
    Event.preventDefault();

    const payload = {
      asunto: asunto,
      texto: contenido,
      user: {
        nombre: userInformation.firstName,
        apellido: userInformation.lastName,
        correo: userInformation.email,
      },
    };

    const response = await fetch(
      "https://createsupportticket-4fwjrlkifa-uc.a.run.app",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  return (
    <>
      <h1>Support tickets</h1>
      
      <div>
        <h2>Asunto:</h2>
        <p></p>
        <h2>Estatus:</h2>
        <p></p>
        <h2>Fecha:</h2>
        <p></p>
      </div>
    </>
  );
};

export default Support;
