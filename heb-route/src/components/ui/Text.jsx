import React from 'react';

import '../../stylesheets/Text.css';

export const Text = ({
    variant='h1',
    styles,
    onClick,
    children,
}) => {
    return (
        <p className={variant} style={styles} onClick={onClick}>
            {children}
        </p>
    );
};