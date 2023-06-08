import React, { useContext, useState, useEffect } from "react";

// Providers
import { AuthContext } from '../providers/AuthProvider';
import { UserInformationContext } from '../providers/UserInformationProvider';

import Loading from '../views/Loading';

const defaultSupportContext = {
    tickets: {
        supportTickets: [],
        isLoading: true,
    },
    getSupportTickets: async() => {},
    createSupportTicket: async(asunto, contenido) => {}
}


export const SupportContext = React.createContext(defaultSupportContext);

export const SupportProvider = props =>{
    const { authState } = useContext(AuthContext);
    const { userInformation } = useContext(UserInformationContext);

    const [supportTickets, setSupportTickets] = useState(defaultSupportContext.tickets);


    const getSupportTickets = async() => {
        const payload = {
            email: userInformation.email,
        };

        const response = await fetch(
        "https://getmysupporttickets-4fwjrlkifa-uc.a.run.app",
            {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
            }
        );
        
        if (response.ok){
            const fetchedTickets = await response.json();
            setSupportTickets({supportTickets: fetchedTickets, isLoading: false});
        }else{
            setSupportTickets({ supportTickets: [], isLoading: false });
        }
    }

    const createSupportTicket = async(asunto, contenido) =>{

        let errorState = {
            error: false,
            errorMessage: null
        }
        const payload = {
            asunto: asunto, texto:contenido,
            user:{
              nombre: userInformation.firstName, 
              apellido: userInformation.lastName,
              correo: userInformation.email
            }
          }
        const response = await fetch("https://createsupportticket-4fwjrlkifa-uc.a.run.app", {
            method:'POST',
            body: JSON.stringify (payload),
            headers: {"Content-Type":"application/json"}
        });
      
        if(response.ok){
            errorState = {
                error: false,
                errorMessage: null
            }
        }else{
            let message = await response.text();
            message = message.length > 0 ? message : null
            errorState = {error: true, errorMessage: message}
        }

        getSupportTickets();
        return errorState
    };

    useEffect(()=>{
        if (userInformation.email === null) return
        getSupportTickets()
    }, [userInformation])

    return (
        <SupportContext.Provider value={{
            tickets: supportTickets,
            getSupportTickets,
            createSupportTicket
        }}>

            {authState.isLoading || supportTickets.isLoading ? <Loading/> :  props.children}
        </SupportContext.Provider>
    )
    
}
