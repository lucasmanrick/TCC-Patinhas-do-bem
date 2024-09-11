const express = require("express");
const router = require('./src/routes/routesapp');
const bcrypt = require('bcrypt');
require("dotenv-safe").config();

const app = express();
const port= 5000;

app.use(express.json());


const users = []; //esse users representa o banco de dados, ou seja a tabela onde receberá o dado criptografado, ou melhor, o local onde ficará armazenado a senha no nosso banco de dados.

app.get('/users', (req,res) => { 
  res.json(users)
})


app.use('/', router)

app.post ('/users', async (req,res) => { //CRIPTOGRAFANDO ANTES DE CADASTRAR NO BANCO DE DADOS.
  try{
    const hashedPassword = await bcrypt.hash(req.body.password,10); // aki ocorre a criptografia da parte da qual queremos, e determinamos que seja 10 apos o campo que queremos criptografar para que 10 mil registros com a mesma senha tenha criptografias diferentes, ou seja se 30 pessoas tiverem a mesma senha as 30 terão criptografias diferentes.
    const user = {name:req.body.name, password:hashedPassword}; // aqui, apenas organizamos os dados ja tratados da forma com qual devem ir ao banco de dados.
    users.push(user); // aki fazemos o envio do usuário 'user' ao banco de dados na tabela 'users'
    res.status(201).send();
  }catch(e) {
    console.log (e)
  }
})


app.post("/login", async(req,res)=> { // COMPARATIVO DE SENHAS (AUTENTICAÇÃO)
  try{
    bcrypt.compare (req.body.password, users[0].password).then(match => {
      if (match) {
        res.status(201).send('senhas coincidentes')
      } else {
        res.status(500).send('senha incorreta')
      }
    }) 
  }
  catch (e) {
    console.log(e)
  }
})


app.listen(port, () => {
    console.log(`Servidor respondendo na porta ${port}`);
});