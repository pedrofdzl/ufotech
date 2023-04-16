import React from 'react';

import '../../stylesheets/Button.css';

export const Button = ({
    variant='primary',
    callbackFunction=()=>{},
    children,
}) => {
    return (
        <button className={`btn btn-${variant}`} onClick={() => callbackFunction()}>
            {children}
        </button>
    );
};
