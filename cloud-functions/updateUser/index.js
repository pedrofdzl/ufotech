const functions = require('@google-cloud/functions-framework');
const mysql = require('promise-mysql');
const Joi = require('joi');

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

const createUnixSocketPool = async config =>{
    return mysql.createPool(config)
};

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

// Query to Update User
const updateUserQuery = async(userData, pool) => {
    const sql = 'UPDATE cliente SET ' +
                `nombre = "${userData.nombre}", ` + 
                `apellido = "${userData.apellido}" ` + 
                `WHERE correo = "${userData.correo}"`
    await pool.query(sql);
}

const checkEmailExists = async(pool, email) =>{
    const result = await pool.query(`SELECT * FROM cliente WHERE correo = "${email}"`);
    if (result.length > 0) return true;
    return false;
}

// User Schema
const userSchema = Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    apellido: Joi.string().min(2).max(255).required(),
    correo: Joi.string().email({ tlds : { allow : false} }).required()
})

functions.http('updateUser', async(req, res)=>{
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

    if (req.method !== 'POST') return res.status(405).send('Method not allowed');

    const userResult = userSchema.validate(req.body);
    if (userResult.error) return res.status(400).send(userResult.error.details[0].message);

    try{
        const pool = await createUnixSocketPool(getRunningConfig());

        const emailExists = await checkEmailExists(pool, req.body.correo);
        if (!emailExists) return res.status(400).send('Email Doesn\'t exists!');

        await updateUserQuery(req.body, pool)

        res.sendStatus(204);

    }catch(e){
        console.log(e);
        res.sendStatus(400)
    }

});