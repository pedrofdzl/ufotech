import React from "react";
import { closeSession } from "../functions/auth";

const Home = () => {
    return (
        <div>
            Sesión iniciada
            <button onClick = { closeSession }> Cerrar sesión </button>
        </div>
    );
};

export default Home;