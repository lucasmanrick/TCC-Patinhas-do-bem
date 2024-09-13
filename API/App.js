const express = require("express");
const router = require('./src/Routes/routesapp');
const bcrypt = require('bcrypt');
require("dotenv-safe").config();

const app = express();
const port= 5000;

app.use(express.json());



app.use('/', router)




app.listen(port, () => {
    console.log(`Servidor respondendo na porta ${port}`);
});