const express = require("express");
const router = require('./src/Routes/routesapp');
const cors = require("cors");
const app = express();

const { createServer } = require('node:http');
const path = require ('node:path')



const newDirName = path.resolve(__dirname, '..','WEB');;
app.use(express.static(newDirName))

const server = createServer(app);



require("dotenv-safe").config();
const cookieParser = require('cookie-parser');


const port= 5000;




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