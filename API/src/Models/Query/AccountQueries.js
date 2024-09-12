const { connection } = require(`../../Config/db`);
const jwt = require('jsonwebtoken');

const AccountManagementQueries = {
  async cadastraUsuarioQuery (dataUser) {
    const conn = await connection();
      try {
        console.log('chegou')                                             
        const uRes = await conn.query(`insert into usuario (Nome,CEP,Rua,Numero,Bairro,Estado,DataNasc,Email,Senha,Administrador,Cidade) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,["teste","teste","teste","teste","teste","teste","teste","teste","teste",0,"teste"]);
        console.log(uRes)
        return {sucess:"você conseguiu se cadastrar com sucesso!!"}
      }
      catch (e) {
        return {error:"houve um erro ao tentar completar o envio de dados: " & e }
      }
  } 
}


module.exports = {AccountManagementQueries}