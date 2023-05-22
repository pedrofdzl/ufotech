import React from 'react';
import { Link } from 'react-router-dom';


const Error404 = props => {
    return <>
        <h1>404</h1>
        <h4>We couldn't find the page you were looking for! Go to <Link to={'/'} replace >Dashboard</Link> </h4>
    </>
}

export default Error404;