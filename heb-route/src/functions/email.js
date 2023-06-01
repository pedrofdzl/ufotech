
/**
 * getSupportEmailTemplate
 * @param {string} name
 * @param {string} status 
 * @param {string} ticketID 
 * @param {string} subject 
 * @param {string} content 
 * @returns HTML Template in form of string
 */

export const getSupportEmailTemplate = ({ name, status, ticketID, subject, content }) => {
    return (
        `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <!--[if mso]> 
        <noscript> 
        <xml> 
        <o:OfficeDocumentSettings> 
        <o:PixelsPerInch>96</o:PixelsPerInch> 
        </o:OfficeDocumentSettings> 
        </xml> 
        </noscript> 
        <![endif]-->
            <style>
                table, td, div, h1, p {font-family: Arial, sans-serif;}
                table, td {border:2px solid #000000 !important;}
            </style>
        </head>
        
        <body style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin:0;
                    padding:0;
                    padding-top: 48px;
                    background-color:#efefef;
        
                    ">
            <div style="margin-left: auto;
            margin-right: auto;">
                <img style="
                    width: 120px;
                    margin-bottom: 16px;
                " 
                src="https://upload.wikimedia.org/wikipedia/commons/d/da/Logo_of_the_HEB_Grocery_Company%2C_LP.png"/>
                <div style="
                        max-width: 400px;
                        background-color: white;
                        padding: 24px 32px;
                        ">
                    <p>
                        Hola ${ name },<br/><br/>
                        Hemos recibido tu ticket, actualmente se encuentra
                        con estatus ${ status }, nos pondremos en contacto
                        lo mas pronto posible.<br/><br/>
                        Ticket: ${ ticketID }<br/>
                        Asunto: ${ subject }<br/>
                        Contenido: ${ content }<br/>
                    </p>
                </div>
            </div>
            <p style="
                    margin-left: auto;
                    margin-right: auto;
                    font-size: 13px;
                    color: gray;
                    ">
                2023© Heb Route | Monterrey, N.L.
            </p>
        </body>
        </html>`
    );
};