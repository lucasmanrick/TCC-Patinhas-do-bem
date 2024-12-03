const express = require("express");
const router = require('./src/Routes/routesapp');
const cors = require("cors");
const path = require ('node:path')
const { Server } = require("socket.io");
const http = require('http')
const cookieParser = require('cookie-parser');
require("dotenv-safe").config();


const app = express();
const server = http.createServer(app);

const newDirName = path.resolve(__dirname, '..','WEB');;
app.use(express.static(newDirName))

const io = new Server(server);





app.use(cookieParser())
app.use(cors())
app.use(express.json());

const port= process.env.PORT !== undefined? process.env.PORT:5000;


io.on('connection', (socket) => {
  // Verifique o token aqui, se necessário
  console.log("novo usuário conectado ao server")
  socket.on('chatInject', (contatoID) => {
    console.log("usuário conectouse a sala " + contatoID)
    if (contatoID) {
      socket.join(`${contatoID}Message`); 
    }
  })

  socket.on('sendMessage', (dataMessage) => {
    console.log(dataMessage)
    if (dataMessage.contatoID) {
      io.to(`${dataMessage.contatoID}Message`).emit('sendMessage', {messageSender: dataMessage.myName, message: dataMessage.messageText, idMensagem: dataMessage.idMensagem, myID: dataMessage.myID} ); 
    }
  })
})






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


server.listen(port , () => {
    console.log(`Servidor respondendo na porta ${port}`);
});
