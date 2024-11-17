const express = require("express");
const router = require('./src/Routes/routesapp');
const cors = require("cors");
const path = require('node:path');
const serverless = require('serverless-http');
const cookieParser = require('cookie-parser');
require("dotenv-safe").config();

const app = express();

const newDirName = path.resolve(__dirname, '..', 'WEB');
app.use(express.static(newDirName));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/', router);

// Aqui você pode manter a lógica do Socket.io, mas lembre-se que isso pode não funcionar bem em um ambiente serverless
const io = require("socket.io")(app.listen(0)); // Ouvindo em uma porta aleatória

io.on('connection', (socket) => {
    socket.on('chatInject', (contatoID) => {
        if (contatoID) {
            socket.join(`${contatoID}Message`);
        }
    });

    socket.on('sendMessage', (dataMessage) => {
        console.log(dataMessage);
        if (dataMessage.contatoID) {
            io.to(`${dataMessage.contatoID}Message`).emit('sendMessage', {
                messageSender: dataMessage.myName,
                message: dataMessage.messageText,
                idMensagem: dataMessage.idMensagem,
                myID: dataMessage.myID
            });
        }
    });
});

// Exporte a função serverless
module.exports.handler = serverless(app);