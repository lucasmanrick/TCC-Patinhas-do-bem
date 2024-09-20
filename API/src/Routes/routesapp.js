require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const accountManagement = require ('../Controllers/accountController');
const petManagement = require("../Controllers/petController")

const users = []; //esse users representa o banco de dados, ou seja a tabela onde receberá o dado criptografado, ou melhor, o local onde ficará armazenado a senha no nosso banco de dados.

function verificadorDoToken(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'Não foi informado nenhum token.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha ao tentar autenticar o token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.dataUser = [{ID:decoded.ID,Nome:decoded.Nome, CEP:decoded.CEP,Rua: decoded.Rua,
      Numero: decoded.Numero,
      Bairro: decoded.Bairro,
      Estado: decoded.Estado,
      DataNasc: decoded.DataNasc,
      Email: decoded.Email,
      Administrador: decoded.Administrador,
      Cidade: decoded.Cidade}];
    next();
  });
}


// rota para o usuário fazer um cadastro no site.
router.post("/Cadastro",accountManagement.cadastraUsuario)


// // rota para o usuário logar no site (será retornado um token ao mesmo)
 router.get('/Login' ,accountManagement.autenticaUsuario) 



 router.post ("/CadastraPet",verificadorDoToken,petManagement.cadastraPet)


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