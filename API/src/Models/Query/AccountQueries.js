const { connection } = require(`../../Config/db`);
const jwt = require('jsonwebtoken');


const AccountManagementQueries = {
  async cadastraUsuarioQuery (dataUser) {
    const conn = await connection();
      try {
        console.log('chegou')                                                                                                                                                                                         
        const uRes = await conn.query("INSERT INTO `Usuario` (`Nome`, `CEP`, `Rua`, `Numero`, `Bairro`, `Estado`, `DataNasc`, `Email`, `Senha`, `Administrador`,`Cidade`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[dataUser.NomeUsuario,dataUser.Cep,dataUser.Rua,dataUser.Numero,dataUser.Bairro,dataUser.Estado,dataUser.DataNasc,dataUser.Email,dataUser.Senha,0,dataUser.Cidade]);
        return {sucess:"você conseguiu se cadastrar com sucesso!!"}
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
      const authResponse = await conn.query("Select ID from Usuario where Email = ? AND Senha = ?",[Email,Senha])
      if(authResponse[0].length > 0) {
        console.log(authResponse[0])
        return (authResponse[0])
      }
    }
    catch (e) {
      console.error(e)
    }
  }
}


module.exports = AccountManagementQueries