const Usuario = require("../Models/Class/Usuario")
const AccountManagementQueries = require("../Models/Query/AccountQueries")
const bcrypt = require('bcrypt');




const accountManagement = {
  cadastraUsuario: async (req, res) => {

    try {
      const { NomeUsuario, DataNasc, Email, Senha, Cep, Rua, Numero, Bairro, Estado, Cidade } = req.body

      if (NomeUsuario, DataNasc, Email, Senha, Cep, Rua, Numero, Bairro, Estado, Cidade) {
        if (typeof (Email) == 'number') {
          res.json({ error: "O Campo Email não pode ser numero" })
        } else if (typeof (NomeUsuario) !== 'string') {
          res.json({ error: "O Campo Nome não pode ser diferente de texto" })
        } else if (typeof (Senha) !== 'string') {
          res.json({ error: "O Campo Senha está com tipo diferente do esperado" })
        } else if (typeof (Cep) !== 'string') {
          res.json({ error: "O Campo CEP está com tipo diferente do esperado" })
        } else if (typeof (Rua) !== 'string') {
          res.json({ error: "O Campo Rua está com tipo diferente do esperado" })
        } else if (typeof (Numero) !== 'number') {
          res.json({ error: "O Campo Numero está com tipo diferente do esperado" })
        } else if (typeof (Bairro) !== 'string') {
          res.json({ error: "O Campo Bairro está com tipo diferente do esperado" })
        } else if (typeof (Estado) !== 'string') {
          res.json({ error: "O Campo Estado está com tipo diferente do esperado" })
        } else if (typeof (Cidade) !== 'string') {
          res.json({ error: "O Campo Cidade está com tipo diferente do esperado" })
        }

        const validaCadastroAnterior = await AccountManagementQueries.verificaExistenciaUsuarioQuery(Email)

        if (validaCadastroAnterior.error) {
          res.json(validaCadastroAnterior)
        } else {
          const hashedPassword = await bcrypt.hash(Senha, 10); // aki ocorre a criptografia da parte da qual queremos, e determinamos que seja 10 apos o campo que queremos criptografar para que 10 mil registros com a mesma senha tenha criptografias diferentes, ou seja se 30 pessoas tiverem a mesma senha as 30 terão criptografias diferentes.

          const newUser = new Usuario(NomeUsuario, DataNasc, Email, hashedPassword, Cep, Rua, Numero, Bairro, Estado, Cidade)
          //verificar se o Email passado já não existe no nosso banco de dados.

          const sendingData = await AccountManagementQueries.cadastraUsuarioQuery(newUser)
          

          res.json({sendingData})
        }

      } else {
        res.json({ error: "Não foi enviado todos campos necessários para fazer o cadastro" })
      }
    }

    catch (e) {
      //res.json({ error: "houve um problema no tratamento de seus dados: " })
    }

  },
  autenticaUsuario: async (req, res) => {
    const { Email, Senha } = req.body;


    try {
      if (Email, Senha) {
        if (typeof (Email) === 'string' && typeof (Senha) === 'string') {
          const re = /\S+@\S+\.\S+/;
          const testRegex = re.test(Email);

          if (testRegex === true) {
            const verifyExistence = await AccountManagementQueries.autenticaUsuarioQuery(Email, Senha);
            res.json(verifyExistence)
          } else {
            res.json({ error: "o valor inserido no campo Email, não corresponde a um Email valido", auth: false })
          }

        } else {
          res.json({ error: "O Email e a senha estão sendo enviados com tipos de dados divergentes do necessário. Contate um Suporte para correção do problema", auth: false })
        }
      } else {
        res.json({ error: "Não foram encaminhados Email e Senha", auth: false })
      }

    }
    catch (e) {
      res.json({ error: e, auth: false })
    }

  }
}


module.exports = accountManagement
