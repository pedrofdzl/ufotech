import React from "react";
import { createUser, logIn } from "../functions/auth";

const Login = (props) => {
    const [isRegistering, setisRegistering] = React.useState(false);

    const submitRegistration = (e) => {
        e.preventDefault();
        const email = e.target.elements.emailField.value;
        const password = e.target.elements.passwordField.value;
        const repPassword = e.target.elements.repPasswordField.value;
        const name = e.target.elements.nameField.value;
        createUser(props, email, name, password, repPassword);
    };
        
    const submitLogin = (e) => {
        e.preventDefault();
        const email = e.target.elements.emailField.value;
        const password = e.target.elements.passwordField.value;
        logIn(props, email, password);
    };

    const renderForm = () => {
        if (isRegistering) {
            return (
                <form onSubmit = { submitRegistration }>
                    <label htmlFor = "emailField"> Correo electrónico </label>
                    <input type = "email" id = "emailField"/>
                    { <br/> }                
                    <label htmlFor = "passwordField"> Contraseña </label>
                    <input type = "password" id = "passwordField"/>
                    { <br/> }
                    <label htmlFor = "repPasswordField"> Repetir contraseña </label>
                    <input type = "password" id = "repPasswordField"/>
                    { <br/> }
                    <label htmlFor = "nameField"> Nombre </label>
                    <input type = "name" id = "nameField"/>
                    { <br/> }
                    <button type = "submit"> Registrarse </button>
                </form>
            );
        }
        return (
            <form onSubmit = { submitLogin }>
                <label htmlFor = "emailField"> Correo electrónico </label>
                <input type = "email" id = "emailField"/>
                { <br/> }                
                <label htmlFor = "passwordField"> Contraseña </label>
                <input type = "password" id = "passwordField"/>
                { <br/> }
                <button type = "submit"> Iniciar sesión </button>
            </form>
        );
    };

    return (
        <div>
            <h1> { isRegistering ? "Regístrate" : "Inicia sesión" } </h1>
            { renderForm() }
            <button onClick = { () => setisRegistering(!isRegistering)}>
                { isRegistering 
                    ? "¿Ya tienes cuenta? Inicia sesión"
                    : "¿No tienes cuenta? Regístrate"
                }
            </button>
        </div>
    );
};

export default Login;