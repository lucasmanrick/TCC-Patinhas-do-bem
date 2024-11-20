const mysql2 = require("mysql2/promise");

// BANCO DE DADOS
const connection = async () => {

    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection;
    }
    const con = await mysql2.createConnection({
        host: 'patinhasdobem.cx64gskaw6rm.sa-east-1.rds.amazonaws.com',
        port: '3306',
        database: 'DB_PatinhasDoBem',
        user: 'admin',
        password:process.env.BDPASSWORD,
        multipleStatements:true
    });
    console.log("Conectou no MySQL!");
    global.connection = con;
    return con;
}

module.exports = { connection };