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
                <Text>Error 500</Text>
                <Text variant={'b2'}>Hubo un error, lo estamos arreglando</Text>
            </div>
        </div>
    );
}

export default Error505;