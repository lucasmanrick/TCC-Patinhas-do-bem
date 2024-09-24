const express = require("express");
const router = require('./src/Routes/routesapp');
const cors = require("cors");

require("dotenv-safe").config();

const app = express();
const port= 5000;

app.use(express.json());


const corsOptions = {
  origin: 'http://192.168.2.253:5000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}


 app.use('/', cors(corsOptions), router)




app.listen(port, () => {
    console.log(`Servidor respondendo na porta ${port}`);
});