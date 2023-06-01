const functions = require('@google-cloud/functions-framework');
const mysql = require('promise-mysql');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const getSupportEmailTemplate = require('./utils');

class ImproperlyConfigureError extends Error{};

// Schemas to validate input data
const userSchema = Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    apellido: Joi.string().min(2).max(255).required(),
    correo: Joi.string().email({tlds: { allow: false}}).required()
})

const ticketSchema = Joi.object({
    asunto: Joi.string().min(3).max(255).required(),
    texto: Joi.string().min(2).max(1000).required()
})

// Validate the presence of all env Variables
const validateEnvVaraibles = () => {
    const vars = ['user', 'password', 'database', 'debug', 'email', 'emailhost', 'emailpwd']

    for (let v of vars){
        if(process.env[v] === undefined){
            throw new ImproperlyConfigureError('Missing env variable: ' + v);
        }
    }

    if (process.env['debug'] === 'true'){
        if (process.env['host'] === undefined) throw new ImproperlyConfigureError('Missing env variable: host');
    }else{
        if (process.env['socketPath'] === undefined) throw new ImproperlyConfigureError('Missing env variable: socketPath');
    }
}

const createUnixSocketPool = async config =>{
    return mysql.createPool(config)
};

// Get the running Config to create socket Pool.
const getRunningConfig = () =>{
    
    let runningConfig = {
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    };
    
    if (process.env.debug === 'true'){
        runningConfig.host = process.env.host
    }else{
        runningConfig.socketPath = process.env.socketPath
    }

    return runningConfig;
};


const getOrCreateUser = async(data, pool) =>{
    let user = {};

    let result = await pool.query('SELECT * FROM cliente WHERE correo = '+ `"${data.correo}"` );

    if (result.length > 0){
        // Populate user Object with retrieved data
        user = {
            id: result[0].cliente_id,
            email: result[0].correo,
            nombre: result[0].nombre,
            apellido: result[0].apellido
        }
    }else{
        // Create new User
        user = {
            email: data.correo,
            nombre: data.nombre,
            apellido: data.apellido
        }

        const sql = 'INSERT INTO cliente (correo, nombre, apellido)'+
                    `VALUES ("${user.email}", "${user.nombre}", "${user.apellido}")`
        result = await pool.query(sql);
        
        result = await pool.query('SELECT * FROM cliente WHERE cliente_id = '+ `"${result.insertId}"`)

        user = {
            id: result[0].cliente_id,
            email: result[0].correo,
            nombre: result[0].nombre,
            apellido: result[0].apellido
        }
    }

    return user;
};

const getOpenStatus = async(pool)=>{
    const result = await pool.query('SELECT * FROM statusTicket WHERE nombre = "Abierto"');
    return {
        id: result[0].status_id,
        nombre: result[0].nombre
    }
}


const sendSuccessEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.emailhost,
        port: 587,
        secure: false,
        auth:{
            user: process.env.email,
            pass: process.env.emailpwd
        }
    });

    await transporter.sendMail({
        from: 'HEB Route <heb.route@gmail.com>',
        to: options.email,
        subject: 'Support Ticket - ' + options.asunto,
        text: `
        Hola, ${options.nombre} ${options.apellido}
        Hemos recibido tu ticket, actualmente se encuentra con estatus ${options.estatus}, nos pondremos en contacto lo mas pronto posible.

        Ticket:
        Asunto: ${options.asunto}
        Contenido: ${options.texto}        
        `,
        html: getSupportEmailTemplate(
            `${options.nombre} ${options.apellido}`,
            options.estatus,
            options.asunto,
            options.texto
            )
    })
}

functions.http('createSupportTicket', async(req, res) => {
    validateEnvVaraibles();

    // Allow CORS
    res.set('Access-Control-Allow-Origin', '*')
    
    // Preflight CORS headers
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.sendStatus(204);
    }

    if (req.method !== 'POST'){
        return res.sendStatus(405);
    }
    
    let user = req.body.user;
    const ticket = { asunto: req.body.asunto, texto: req.body.texto }
    
    // Validate received data
    const userResult = userSchema.validate(user);
    if (userResult.error) return res.status(400).send(userResult.error.details[0].message);
    
    const ticketResult = ticketSchema.validate(ticket);
    if (ticketResult.error) return res.status(400).send(ticketResult.error.details[0].message);
    

    
    try{
        const pool = await createUnixSocketPool(getRunningConfig());
        user = await getOrCreateUser(user, pool);
        let openStatus = await getOpenStatus(pool);
        let pub_date = new Date();
        pub_date = `${pub_date.getFullYear()}-${pub_date.getMonth()+1}-${pub_date.getDate()}`;
        pub_date.month
        let sql = 'INSERT INTO ticket (asunto, comentario, pub_date, cliente_id_ticket, status_id_ticket) VALUES ' +
        `("${ticket.asunto}", "${ticket.texto}","${pub_date}", "${user.id}", "${openStatus.id}")`;
        const result = await pool.query(sql);

        await sendSuccessEmail({
            ...user,
            ...ticket,
            estatus: openStatus.nombre
        })
        pool.end()
        
        res.sendStatus(204)
    }catch(e){
        console.log(e);
        res.sendStatus(400);
    }
});