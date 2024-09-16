const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const accountManagement = require ('../Controllers/accountController')

const users = []; //esse users representa o banco de dados, ou seja a tabela onde receberá o dado criptografado, ou melhor, o local onde ficará armazenado a senha no nosso banco de dados.

// rota para o usuário fazer um cadastro no site.
router.post("/Cadastro",accountManagement.cadastraUsuario)


router.get("/",(req,res) => {
  res.json({testeCors:"hail"})
})


// // rota para o usuário logar no site (será retornado um token ao mesmo)
// router.get('/Login',verifyJWT, pessoaControllers.retornaTodasEspecialidades) 



// app.get('/users', (req,res) => { 
//   res.json(users)
// })


// app.post ('/users', async (req,res) => { //CRIPTOGRAFANDO ANTES DE CADASTRAR NO BANCO DE DADOS.
//   try{
//    const user = {name:req.body.name, password:hashedPassword}; // aqui, apenas organizamos os dados ja tratados da forma com qual devem ir ao banco de dados.
//users.push(user); // aki fazemos o envio do usuário 'user' ao banco de dados na tabela 'users'
          
//     res.status(201).send();
//   }catch(e) {
//     console.log (e)
//   }
// })


// app.post("/login", async(req,res)=> { // COMPARATIVO DE SENHAS (AUTENTICAÇÃO)
//   try{
//     bcrypt.compare (req.body.password, users[0].password).then(match => {
//       if (match) {
//         res.status(201).send('senhas coincidentes')
//       } else {
//         res.status(500).send('senha incorreta')
//       }
//     }) 
//   }
//   catch (e) {
//     console.log(e)
//   }
// })





module.exports = router;