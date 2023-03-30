import React, { useEffect } from "react";
import { app } from "./firebase/key";
import Home from "./home";
import Login from "./Login";

function App() {
  const [usuario, setUsuario] = React.useState(null);

  // Verifies if session of user is open
  useEffect(() => {
    app.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user);
      } 
      else {
        setUsuario(null);
      }
    });
  }, []);
  
  return <>{ usuario ? <Home /> : <Login setUsuario = { setUsuario }/>}</>
}

export default App;
