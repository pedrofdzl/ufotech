const functions = require('@google-cloud/functions-framework');
const mysql = require('promise-mysql');
const Joi = require('joi');


class ImproperlyConfigureError extends Error{};

// Create a unix Socket Pool to connect to DB
const createUnixSocketPool = config =>{
    return mysql.createPool(config);
}

const emailSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false }}).required()
});


// Validate the presence of all env Variables
const validateEnvVaraibles = () => {
    const vars = ['user', 'password', 'database', 'debug']

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

functions.http('getMySupportTickets',async(req, res)=>{

    // Validate Variables
    validateEnvVaraibles();

    res.set('Access-Control-Allow-Origin', '*');

    // CORS preflight Message
    if (req.method === 'OPTIONS'){
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.sendStatus(204);
    }


    if (req.method !== 'POST') return res.sendStatus(405);

    const emailResult = emailSchema.validate(req.body);
    if (emailResult.error) return res.status(400).send(emailResult.error.details[0].message)

    if (!req.body.email) return res.status(400).send('Missing Email');

    try{
        const pool = await createUnixSocketPool(getRunningConfig());
        const results = await pool.query(`CALL getMyTickets("${req.body.email}")`);
        // console.log(results[0]);

        pool.end()
        return res.send(results[0]);
    }catch(e){
        console.log(e)
        res.sendStatus(400)
    }
}); 