const Usuario = require("../Models/Class/Usuario")
const bcrypt = require('bcrypt');




const UsuarioController = {
  cadastraUsuario: async (req, res) => {

    try {
      const { NomeUsuario, DataNasc, Email, Senha, Cep, Rua, Numero, Bairro, Estado, Cidade } = req.body

      if (NomeUsuario, DataNasc, Email, Senha, Cep, Rua, Numero, Bairro, Estado, Cidade) {
        if (typeof (Email) !== 'string') {
          return res.json({ error: "O Campo Email não pode ser numero" })
        } else if (typeof (NomeUsuario) !== 'string') {
          return res.json({ error: "O Campo Nome não pode ser diferente de texto" })
        } else if (typeof (Senha) !== 'string') {
          return res.json({ error: "O Campo Senha está com tipo diferente do esperado" })
        } else if (typeof (Cep) !== 'string') {
          return res.json({ error: "O Campo CEP está com tipo diferente do esperado" })
        } else if (typeof (Rua) !== 'string') {
          return res.json({ error: "O Campo Rua está com tipo diferente do esperado" })
        } else if (typeof (Numero) !== 'number') {
          return res.json({ error: "O Campo Numero está com tipo diferente do esperado" })
        } else if (typeof (Bairro) !== 'string') {
          return res.json({ error: "O Campo Bairro está com tipo diferente do esperado" })
        } else if (typeof (Estado) !== 'string') {
          return res.json({ error: "O Campo Estado está com tipo diferente do esperado" })
        } else if (typeof (Cidade) !== 'string') {
          return res.json({ error: "O Campo Cidade está com tipo diferente do esperado" })
        }

        const re = /\S+@\S+\.\S+/;
        const testRegex = re.test(Email);


        if(testRegex === false) {
         return res.json({error:"seu e-mail é invalido verifique se está correto e tente novamente."})
        } 
        const hashedPassword = await bcrypt.hash(Senha, 10); // aki ocorre a criptografia da parte da qual queremos, e determinamos que seja 10 apos o campo que queremos criptografar para que 10 mil registros com a mesma senha tenha criptografias diferentes, ou seja se 30 pessoas tiverem a mesma senha as 30 terão criptografias diferentes.
        let newUser = new Usuario(null,NomeUsuario, DataNasc, Email, hashedPassword, Cep, Rua, Numero, Bairro, Estado, Cidade)


        const validaCadastroAnterior = await Usuario.verificaExistenciaUsuarioQuery(Email)
        if (validaCadastroAnterior.error) {
          return res.json(validaCadastroAnterior)
        } else {

          const sendingData = await newUser.cadastraUsuarioQuery()
          return res.json(sendingData)
        }

      } else {
        return res.json({ error: "Não foi enviado todos campos necessários para fazer o cadastro" })
      }
    }

    catch (e) {
      return res.json({ error: e.message})

    }

  },
  autenticaUsuario: async (req, res) => {
    const { Email, Senha } = req.body;

    const verifyMobileOrWeb = req.headers.platform;
    try {
      if (Email, Senha) {
        if (typeof (Email) === 'string' && typeof (Senha) === 'string') {
          const re = /\S+@\S+\.\S+/;
          const testRegex = re.test(Email);

          if (testRegex === true) {

            const newUser = new Usuario ();
            newUser.Email = Email
            newUser.Senha = Senha
            const verifyExistence = await newUser.autenticaUsuarioQuery();
            

            if(verifyExistence.auth === true) {
              if(verifyMobileOrWeb === "mobile") {
                return res.json({sucess:verifyExistence.success,auth:verifyExistence.auth, token:verifyExistence.token})
              }else {
                res.cookie('token', verifyExistence.token, {
                  secure: true, // O cookie só será enviado em conexões HTTP
                  httpOnly: true, // O cookie não será acessível via JavaScript no navegador
                  maxAge: 3600000 // Tempo de vida do cookie em milissegundos (1 hora)
                })
               return res.json({sucess:verifyExistence.success,auth:verifyExistence.auth, Administrador:verifyExistence.Administrador})
              }
              
            }

            return res.json(verifyExistence)
            
         
          } else {
            return res.json({ error: "o valor inserido no campo Email, não corresponde a um Email valido", auth: false })
          }

        } else {
          return res.json({ error: "O Email e a senha estão sendo enviados com tipos de dados divergentes do necessário. Contate um Suporte para correção do problema", auth: false })
        }
      } else {
        return res.json({ error: "Não foram encaminhados Email e Senha", auth: false })
      }

    }
    catch (e) {
     return res.json({ error: e.message, auth: false })
    }

  },


  removeDadosUsuario : async (req,res) => {
    try {
      const {ID,Administrador} = req.dataUser;
      const {userToBeDeletedID} = req.body;

      if(userToBeDeletedID && Administrador === 1) {
        const sendingRequestRemoveUser = await Usuario.removeDadosUsuarioQuery(ID,userToBeDeletedID);
        return res.json(sendingRequestRemoveUser)
      } 
      else {
        const sendingRequestToDeletYourself = await Usuario.removeDadosUsuarioQuery(ID);
        return res.json(sendingRequestToDeletYourself)
      }

    }
    catch(e) {
      return res.json({error:e.message})
    }
  },


  editaDadosCadastrais: async (req,res) => {
    const {ID} = req.dataUser;
    const {NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero,Bairro,Estado,Cidade} = req.body;
    try {
      if(ID) {
        const hashedNewPassword = await bcrypt.hash(Senha, 10); 
        const newUserGenerate = new Usuario(ID,NomeUsuario,DataNasc,Email,hashedNewPassword,Cep,Rua,Numero,Bairro,Estado,Cidade)
        const sendingDataEdited = await newUserGenerate.editaDadosCadastraisQuery()
        return res.json(sendingDataEdited)
      }else {
        return res.json({error:"falta informações para ser enviado "})
      }
    }catch (e) {
      return res.json({error:e.message})
    }
  }
}


module.exports = UsuarioController
