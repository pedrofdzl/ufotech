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
                <Text>Pagina No Encontrada!</Text>
                <Text variant={'b2'}>Parece que la página que estas buscando no existe, regresa al <Link to={'/'} replace ><span>Dashboard</span></Link> </Text>
            </div>
        </div>
    );
}

export default Error404;