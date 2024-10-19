const express = require("express");
const router = require('./src/Routes/routesapp');
const cors = require("cors");
const app = express();




require("dotenv-safe").config();
const cookieParser = require('cookie-parser');


// const http = require('http').createServer(app)
// const io = require ('socket.io')(http)


const port= 5000;


// io.on('connection', (socket) => {
//   console.log('new connection')
// })


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




app.listen(port, () => {
    console.log(`Servidor respondendo na porta ${port}`);
});

