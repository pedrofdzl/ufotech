import React from 'react';

import '../../stylesheets/Text.css';

export const Text = ({
    variant='h1',
    styles,
    children,
}) => {
    return (
        <p className={variant} style={styles}>
            {children}
        </p>
    );
};