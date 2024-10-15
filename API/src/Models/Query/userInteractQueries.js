const {connection} = require('../../Config/db');
const {ref, uploadBytesResumable} = require (`firebase/storage`)
const {storage} = require (`../../Config/firebase`)
const Pet = require("../Class/Pet")

const userInteractQueries = {
 

   async profileUserQuery(usuarioASerRetornado, userID) {
    const conn = await connection(); 

    if (userID && !usuarioASerRetornado) { // se o usuário solicitou analise de algum perfil e não passou id será retornado as informações dele mesmo, caso ele passe id sera pego os dados do usuário solicitado.
      //returnDataCleaned pega os dados (que podem ser vistos) do usuário que será visto o perfil.
      const returnDataCleaned = await conn.query("select u.Nome, u.CEP, u.Rua, u.Numero, u.Bairro, u.Estado, u.DataNasc,u.Cidade, u.Email  from usuario As u WHERE id=? ",[userID]);   
      const returnPetsUser = await Pet.petsDeUmUsuarioQuery(userID);


      if(returnDataCleaned[0].length >=1) {
        

       return {success:"retornando dados do seu perfil para uso"  ,dadosUsuario: returnDataCleaned[0][0],dadosPetsUsuario:returnPetsUser.dataResponse}
      }else {
        return{error:"não foi possivel retornar dados do seu perfil, tente novamente por favor"}
      }

    } else { // se o usuário quiser ver o perfil de outra pessoa
      const returnAnotherUserProfile = await conn.query ("select u.Nome, u.Bairro, u.Estado, u.DataNasc,u.Cidade from usuario As u WHERE id=? ",[usuarioASerRetornado]);
      const returnPetsOfThisUser = await Pet.petsDeUmUsuarioQuery(usuarioASerRetornado);
      const verifyContactVinculate = await conn.query("select * from contato WHERE IDSolicitante=? AND IDDestinatario = ? OR IDSolicitante=? AND IDDestinatario=?",[userID,usuarioASerRetornado,usuarioASerRetornado,userID])
      const verifyInviteExistence = await conn.query("select * from solicitacaocontato where IDSolicitante =? AND IDDestinatario = ? OR IDDestinatario=? AND IDSolicitante = ?",[userID,usuarioASerRetornado,usuarioASerRetornado,userID])

      let saoAmigos;
      let envioAmizadePendente;
      verifyContactVinculate[0].length >=1?saoAmigos = true:saoAmigos = false  
      verifyInviteExistence[0].length >=1?envioAmizadePendente = true:envioAmizadePendente = false
  

      if(returnAnotherUserProfile[0].length >=1) {
        return {success: "retornando dados de perfil do usuário solicitado", dadosUsuario:returnAnotherUserProfile[0][0], dadosPetsUsuario:returnPetsOfThisUser.dataResponse, saoAmigos:saoAmigos,envioAmizadeFoiFeito:envioAmizadePendente}
      } else {
        return {error:"não foi possivel retornar dados do perfil do usuário especificado"}
      }
    }
   }

   
}

module.exports = userInteractQueries;