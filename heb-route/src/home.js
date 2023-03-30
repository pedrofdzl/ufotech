import React from "react";
import { app } from "./firebase/firebase";
import { closeSession } from "./firebase/firebase";

const Home = () => {
    return (
        <div>
            Sesión iniciada
            <button onClick = { closeSession }> Cerrar sesión </button>
        </div>
    );
};

export default Home;