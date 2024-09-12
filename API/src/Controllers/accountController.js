const Usuario = require("../Models/Class/Usuario")
const AccountQueries = require("../Models/Query/AccountQueries")


const accountManagement = {
  cadastraUsuario: async (req,res) =>  {
    
    try {
      const {NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero,Bairro,Estado,Cidade} = req.body

      if(NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero,Bairro,Estado,Cidade) {
          if (typeof(Email) == 'number') {
            res.json ({error:"O Campo Email não pode ser numero"})
          }else if (typeof(Cep) !== 'number') {
            res.json ({error:"O Campo Cep não pode ser texto"})
          }

          
          const newUser = new Usuario(NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero,Bairro,Estado,Cidade)
          //verificar se o Email passado já não existe no nosso banco de dados.
  
          const sendingData = await AccountQueries.AccountManagementQueries.cadastraUsuarioQuery(newUser)
          


          res.json(sendingData)
  
      }
    }
    
    catch(e) {
      res.json ({error:"houve um problema no tratamento de seus dados: "})
    }

  }
}


module.exports = accountManagement