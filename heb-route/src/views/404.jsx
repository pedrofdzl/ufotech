import React from 'react';
import { Link } from 'react-router-dom';

// Components
import { Text } from "../components/ui/Text";

// Stylesheets
import '../stylesheets/Errors.css';

const Error404 = () => {
    return (
        <div className='error-container'>
            <div className='centered-container'>
                <Text>¡Página No Encontrada!</Text>
                <Text variant={'b2'}>La página que estás buscando no existe, regresa a la <Link to={'/'} replace ><span>Página de inicio</span></Link> </Text>
            </div>
        </div>
    );
}

export default Error404;