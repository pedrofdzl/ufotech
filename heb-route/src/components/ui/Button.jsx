import React from 'react';

import '../../stylesheets/Button.css';

import Spinner from "react-activity/dist/Spinner";
import "react-activity/dist/Spinner.css";

export const Button = ({
    variant='primary',
    callbackFunction=()=>{},
    styles,
    disabled = false,
    loading = false,
    type='button',
    children,
}) => {
    return (
        <button style={styles} className={`btn btn-${variant} ${disabled && 'btn-disabled'}`} onClick={() => {if (!disabled && !loading) callbackFunction()}} type={type} disabled={disabled || loading}>
            {loading ? <Spinner style={{ width: 23, height: 23, transform: 'translateY(-2px)' }}/> : children}
        </button>
    );
};
