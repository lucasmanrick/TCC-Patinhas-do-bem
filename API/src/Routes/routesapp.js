require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const accountManagement = require ('../Controllers/accountController');
const petManagement = require("../Controllers/petController")


function verificadorDoToken(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'Não foi informado nenhum token.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha ao tentar autenticar o token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.dataUser = {ID:decoded.ID,Nome:decoded.Nome, CEP:decoded.CEP,Rua: decoded.Rua,
      Numero: decoded.Numero,
      Bairro: decoded.Bairro,
      Estado: decoded.Estado,
      DataNasc: decoded.DataNasc,
      Email: decoded.Email,
      Administrador: decoded.Administrador,
      Cidade: decoded.Cidade};
    next();
  });
}


// rota para o usuário fazer um cadastro no site.
router.post("/Cadastro",accountManagement.cadastraUsuario)


//Rota para o usuário logar no site (será retornado um token ao mesmo)
 router.post('/Login' ,accountManagement.autenticaUsuario) 


//Rota para cadastrar os dados de um novo pet 
 router.post ("/CadastraPet",verificadorDoToken,petManagement.cadastraPet);


  //Rota para Editar informações de um pet já cadastrado.
 router.put("/EditaPetInfo", verificadorDoToken,petManagement.editaPetInfo);


 //remove um pet da adoção ou inativa (obs: todos registros com status 1 está para adoção, todos registros com status 0 é por que foram doados graças a rede e só inativamos o registro).
 router.delete ("/RetiraPetAdocao",verificadorDoToken,petManagement.removePetDaAdocao)



  //puxa todos animais de um usuário especifico.
  router.get("/PetsUser", verificadorDoToken, petManagement.petsDeUmUsuario)


  //puxa todos animais que estão para adoção no mesmo estado da pessoa.
  router.get("/PetsAdocao", verificadorDoToken, petManagement.petsParaAdocao)


  //Rota que pode-se demonstrar interesse em um pet
  router.post ("/DemonstrarInteressePet", verificadorDoToken, petManagement.demonstrarInteresseEmPet)


  //Rota para ver todos animais que eu demonstrei interesse
  router.get ("/InteressadosMeuPet", verificadorDoToken, petManagement.interessadosMeuPet)


  //Rota para ver os pets no qual eu demonstrei interesse
  router.get ("/MeusInteresses", verificadorDoToken, petManagement.meusInteresses)


  //Rota para tirar interesse em algum pet
  router.delete ("/RemoverInteressePet", verificadorDoToken, petManagement.removerInteressePet);



  //Rota para Solicitar amizade de um usuário sem que haja interesse em algum de seus pets.

  router.post ("/SolicitaAmizade", verificadorDoToken, petManagement.enviarSolicitacaoDeAmizade)

module.exports = router;