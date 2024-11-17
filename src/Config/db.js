const mysql2 = require("mysql2/promise");

// BANCO DE DADOS
const connection = async () => {

    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection;
    }
    const con = await mysql2.createConnection({
        host: 'junction.proxy.rlwy.net',
        port: '49382',
        database: 'railway',
        user: 'root',
        password:process.env.BDPASSWORD,
        multipleStatements:true
    });
    console.log("Conectou no MySQL!");
    global.connection = con;
    return con;
}

module.exports = { connection };