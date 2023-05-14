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
    children,
}) => {
    return (
        <button style={styles} className={`btn btn-${variant} ${disabled && 'btn-disabled'}`} onClick={() => {if (!disabled && !loading) callbackFunction()}} type='button' disabled={disabled || loading}>
            {loading ? <Spinner/> : children}
        </button>
    );
};
