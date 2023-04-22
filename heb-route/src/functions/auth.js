import "firebase/compat/auth";
import 'firebase/compat/firestore';
import { app } from "../firebase/firebase";

export const register = (name, email, password, repPassword) => {

    const regEmail = /\S+@\S+\.\S+/;
    
    if (regEmail.test(email)) {
        if (password === repPassword) {	
            if (password.length >= 8) {
                if (name.length >= 3) {
                    app.auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((user) => {
                        alert("Usuario creado exitosamente");
                        console.log("Usuario Creado:", user.user)
                    }).catch((error) => {
                        console.log(error.code);
                        console.log(error.message);
                        alert("Error: el correo electrónico ya está registrado");
                    });
                    app.firestore().collection("users").doc(email).set({
                        email: email,
                        name: name
                    });
                }
                else {
                    alert("El nombre debe tener al menos 3 caracteres");
                }
            }
            else {
                alert("La contraseña debe tener al menos 8 caracteres");
            }
        }
        else {
            alert("Las contraseñas no coinciden");
        }
    }
    else {
        alert("El correo electrónico no es válido");
    }
};