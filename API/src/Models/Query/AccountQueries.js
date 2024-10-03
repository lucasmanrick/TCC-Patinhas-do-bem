const { connection } = require(`../../Config/db`);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AccountManagementQueries = {
  async cadastraUsuarioQuery (dataUser) {
    const conn = await connection();
      try {                                                                                                                                                                                 
        const uRes = await conn.query("INSERT INTO `Usuario` (`Nome`, `CEP`, `Rua`, `Numero`, `Bairro`, `Estado`, `DataNasc`, `Email`, `Senha`, `Administrador`,`Cidade`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[dataUser.NomeUsuario,dataUser.Cep,dataUser.Rua,dataUser.Numero,dataUser.Bairro,dataUser.Estado,dataUser.DataNasc,dataUser.Email,dataUser.Senha,0,dataUser.Cidade]);
        if(uRes[0].affectedRows >=1) {
          return {sucess:"você conseguiu se cadastrar com sucesso!!"}
        }else {
          return {error:"não foi possivel cadastrar o usuário no nosso sistema tente novamente!"}
        }
      }
      catch (e) {
        return {error:"houve um erro ao tentar completar o envio de dados: " & e }
      }
  },
  async verificaExistenciaUsuarioQuery (Email) {
    const conn = await connection();
    try{
      const existenceReturn = await conn.query("Select Email from Usuario Where Email = ?", [Email])

      if(existenceReturn[0].length > 0) {
        return {error:"Um usuário com esse Email já está registrado em nosso sistema, tente utilizar outro!"}
      }else {
        return {sucess:"Usuário apto a prosseguir com cadastro."}
      }
    }catch(e) {
      console.error(e)
    }
  },
  async autenticaUsuarioQuery (Email,Senha) {
    const conn = await connection();

    try {
      const authResponse = await conn.query("Select * from Usuario where Email = ?",[Email])
      if(authResponse[0].length > 0) {
        const authVerify = await bcrypt.compare(Senha,authResponse[0][0].Senha)
        if(authVerify === true) {
          
          const token = jwt.sign({ ID: authResponse[0][0].ID, Nome:authResponse[0][0].Nome,CEP:authResponse[0][0].CEP,Rua:authResponse[0][0].Rua,Numero:authResponse[0][0].Numero,Bairro:authResponse[0][0].Bairro,Estado:authResponse[0][0].Estado,DataNasc:authResponse[0][0].DataNasc,Email:authResponse[0][0].Email,Administrador:authResponse[0][0].Administrador,Cidade:authResponse[0][0].Cidade}, process.env.SECRET, {
            expiresIn: 10000 // tempo em que o token irá expirar em segundos
          });

          return ({sucess:"Usuário logado com sucesso",auth:true,token:token})
          
        } else {
          return ({error:"Email ou senha incorreta.",auth:false})
        }
   
      }else {
        return{error:"não foi identificado nenhum usuário com essas credenciais"}
      }
    }
    catch (e) {
      console.error(e)
    }
  }
}


module.exports = AccountManagementQueries