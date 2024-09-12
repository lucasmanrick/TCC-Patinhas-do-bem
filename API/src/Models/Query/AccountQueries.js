const { connection } = require(`../../Config/db`);


const AccountManagementQueries = {
  cadastraUsuarioQuery: async (dataUser) => {
    let returnMessage;
    const conn = await connection();
      try {
        const dataSend = await conn.query('INSERT INTO USUARIO (`Nome`,`CEP`,`Rua`,`Numero`,`Bairro`,`Estado`,`DataNasc`,`Email`,`Senha`,`Administrador`,`Cidade`)VALUES (?,?,?,?,?,?,?,?,?,?,?))',[dataUser.Nome,dataUser.DataNasc,dataUser.Email,dataUser.Senha,dataUser.Cep,dataUser.Rua,dataUser.Numero,dataUser.Bairro,dataUser.Estado,dataUser.Cidade]) 
        returnMessage = {sucess:"você conseguiu se cadastrar com sucesso!!"}
        console.log(dataSend)
        return returnMessage
      }
      catch (e) {
        return {error:"houve um erro ao tentar completar o envio de dados: " & e }
      }
  } 
}


module.exports = {AccountManagementQueries}