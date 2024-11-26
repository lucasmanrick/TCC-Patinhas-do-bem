const mysql2 = require("mysql2/promise");

// BANCO DE DADOS
const connection = async () => {

    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection;
    }
    const con = await mysql2.createConnection({
        host: process.env.HOST,
        port: process.env.PORT,
        database: 'DB_PatinhasDoBem',
        user: process.env.USER,
        password:process.env.BDPASSWORD,
        multipleStatements:true
    });
    console.log("Conectou no MySQL!");
    global.connection = con;
    return con;
}

module.exports = { connection };