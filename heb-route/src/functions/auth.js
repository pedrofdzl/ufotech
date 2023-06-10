import "firebase/compat/auth";
import 'firebase/compat/firestore';
import { app, db } from "../firebase/firebase";
import { delay } from "../utils/utils";
import { setDoc, doc } from 'firebase/firestore'

const registerToSQL = async(name, lastname, email) => {
    const response = await fetch('https://registeruser-4fwjrlkifa-uc.a.run.app',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ correo: email, nombre: name, apellido: lastname })
    })

    if (response.ok){
        console.log('Register User in SQL');
    }else{
        console.log('User not register on SQL')
    }
}

export const register = async(name, lastname, email, password, repPassword, sucess) => {
    let errorState = {
        error: false,
        message: ''
    }

    const regEmail = /\S+@\S+\.\S+/;
    if (!regEmail.test(email)) 
        return { error: true, message: 'El correo electrónico no es válido' }

    if (password !== repPassword) 
        return { error: true, message: 'Las contraseñas no coinciden.' }
    
    if (password.length < 8) 
        return { error: true, message: 'La contraseña debe tener al menos 8 caracteres.'}

    if (name.length < 2) 
        return { error: true, message: 'El nombre debe tener al menos 2 caracteres.'}

    if (lastname.length < 2)
        return { error: true, message: 'El apellido debe tener al menos 2 caracteres.'}
    

    // app.auth().createUserWithEmailAndPassword(email, password).then(user=>{
    //     // Register to sql
    //     registerToSQL(name, lastname, email)
    //     app.firestore().collection("users").doc(email).set({
    //         email: email,
    //         name: name,
    //         lastname: lastname,
    //     }).then(data=>{
    //         delay(10000)
    //         sucess()
    //     });
    // }).catch(e=>{
    //     console.log(e.code);
    //     console.log(e.message);
    //     errorState =  { error: true, message: 'El correo electrónico ya está registrado'}
    // })

    try{
        const user = await app.auth().createUserWithEmailAndPassword(email, password)
        // Register to sql
        registerToSQL(name, lastname, email)
        await setDoc(doc(db, 'users', email), {
            email: email,
            name: name,
            lastname: lastname,
        });

        delay(9000);
        sucess();

    }catch(e){
            console.log(e.code);
            console.log(e.message);
        errorState =  { error: true, message: 'El correo electrónico ya está registrado'}
    }
    // console.log(errorState);
    return errorState


    // if (regEmail.test(email)) {
    //     if (password === repPassword) {	
    //         if (password.length >= 8) {
    //             if (name.length >= 3) {
    //                 app.auth()
    //                 .createUserWithEmailAndPassword(email, password)
    //                 .then((user) => {
    //                     alert("Usuario creado exitosamente");

    //                     // Register to sql
    //                     registerToSQL(name, lastname, email)

    //                     console.log("Usuario Creado:", user.user)
    //                 }).catch((error) => {
    //                     console.log(error.code);
    //                     console.log(error.message);
    //                     alert("Error: el correo electrónico ya está registrado");
    //                 });
    //                 app.firestore().collection("users").doc(email).set({
    //                     email: email,
    //                     name: name,
    //                     lastname: lastname,
    //                 });
    //             }
    //             else {
    //                 alert("El nombre debe tener al menos 3 caracteres");
    //             }
    //         }
    //         else {
    //             alert("La contraseña debe tener al menos 8 caracteres");
    //         }
    //     }
    //     else {
    //         alert("Las contraseñas no coinciden");
    //     }
    // }
    // else {
    //     alert("El correo electrónico no es válido");
    // }
};