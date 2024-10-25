const express = require("express");
const router = require('./src/Routes/routesapp');
const cors = require("cors");
const { createServer } = require('node:http');
const path = require ('node:path')
const { Server } = require("socket.io");


const app = express();

const newDirName = path.resolve(__dirname, '..','WEB');;
app.use(express.static(newDirName))

const server = createServer(app);
const io = new Server(server);

require("dotenv-safe").config();
const cookieParser = require('cookie-parser');



const port= 5000;


io.on('connection', (socket) => {
  // Verifique o token aqui, se necessário
  console.log('nova conexão')
  socket.on('chatInject', (contatoID) => {
    console.log('entrou em uma sala', contatoID)
    if (contatoID) {
      socket.join(`${contatoID}Message`); 
    }
  })

  socket.on('sendMessage', (dataMessage) => {
    if (dataMessage.contatoID) {
      io.to(`${dataMessage.contatoID}Message`).emit('sendMessage', {messageSender: dataMessage.myName, message: dataMessage.messageText, idMensagem: dataMessage.idMensagem} ); 
    }
  })
})


// io.on('connection', (socket) => {
//   console.log('usuário está vendo mensagens com outro usuário')
//   socket.broadcast.emit('msg', msg)
//   socket.join (`${contactID}Message`)
// })


// io.to (`${IDContato}Message`).emit('msg', Texto);

app.use(cookieParser());
app.use(express.json());


// const corsOptions = {
//   origin: 'http://192.168.2.253:5000',
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// }

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next()
  })
 app.use('/', router)




server.listen(port, () => {
    console.log(`Servidor respondendo na porta ${port}`);
});

module.exports = server