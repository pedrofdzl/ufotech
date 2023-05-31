import React from 'react';

import { http404 } from '../errorhandling/errors';

const TestError = props => {
    if (props.hasError) {
        // throw new Error('404');
        throw new http404('404');
    }else{
        return <h1>No Error</h1>
    }

}

export default TestError