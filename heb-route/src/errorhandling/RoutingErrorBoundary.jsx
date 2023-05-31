import React from 'react'

import Error404 from '../views/404';
import Error505 from '../views/505';


class RoutingErrorBoundary extends React.Component{
    state = { hasError: false, error: new Error()}

    static getDerivedStateFromError(error){
        return {hasError: true, error};
    }
    
    componentDidCatch(error, info){
        console.log(error,info)
    }

    render(){
        if(this.state.hasError){          
            return <Error404 />
        }
        return this.props.children
    }
}


export default RoutingErrorBoundary;