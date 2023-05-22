import React from 'react'

import Error505 from '../views/505';


class ErrorBoundary extends React.Component{
    state = { hasError: false, error: new Error()}

    static getDerivedStateFromError(error){
        return {hasError: true, error};
    }

    componentDidCatch(error, info){
        console.log(error,info)
    }

    render(){
        if(this.state.hasError){          
            return <Error505 />
        }
        return this.props.children
    }
}


export default ErrorBoundary;