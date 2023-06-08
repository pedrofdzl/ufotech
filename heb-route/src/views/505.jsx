import React from 'react';
import { Link } from 'react-router-dom';

// Components
import { Text } from "../components/ui/Text";

// Stylesheets
import '../stylesheets/Errors.css';

const Error505 = () => {
    return (
        <div className='error-container'>
            <div className='centered-container'>
                <Text>Error interno de servidor</Text>
                <Text variant={'b2'}>Hubo un error interno de servidor, disculpe las molestias</Text>
            </div>
        </div>
    );
}

export default Error505;