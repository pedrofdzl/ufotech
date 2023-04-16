import "firebase/compat/auth";
import 'firebase/compat/firestore';
import { app } from "../firebase/firebase";

export const createUser = (name, email, password, repPassword, setCurrentUser, callbackFunction) => {

    const regEmail = /\S+@\S+\.\S+/;
    
    if (regEmail.test(email)) {
        if (password === repPassword) {	
            if (password.length >= 8) {
                if (name.length >= 3) {
                    app.auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        alert("Usuario creado exitosamente");
                        console.log("Usuario Creado:", userCredential.user)
                        setCurrentUser(userCredential);
                        callbackFunction('/');
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

export const login = (email, password, setCurrentUser, callbackFunction) => {
    app.auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log("Usuario Iniciado:", userCredential.user);
        setCurrentUser(userCredential);
        callbackFunction('/');
    }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
    });
};

export const closeSession = () => {
    app.auth().signOut();
};