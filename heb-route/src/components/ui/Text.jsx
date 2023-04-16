import React from 'react';

import '../../stylesheets/Text.css';

export const Text = ({
    variant='h1',
    children,
}) => {
    return (
        <p className={variant}>
            {children}
        </p>
    );
};