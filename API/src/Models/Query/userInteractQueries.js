const {connection} = require('../../Config/db');
const Pet = require("../Class/Pet")

const userInteractQueries = {
 

   async profileUserQuery(usuarioASerRetornado, userID) {
    const conn = await connection();

    if (userID && !usuarioASerRetornado) { // se o usuário solicitou analise de algum perfil e não passou id será retornado as informações dele mesmo, caso ele passe id sera pego os dados do usuário solicitado.
      //returnDataCleaned pega os dados (que podem ser vistos) do usuário que será visto o perfil.
      const returnDataCleaned = await conn.query("select u.Nome, u.CEP, u.Rua, u.Numero, u.Bairro, u.Estado, u.DataNasc,u.Cidade, u.Email  from usuario As u WHERE id=? ",[userID]);   
      const returnPetsUser = await Pet.petsDeUmUsuarioQuery(userID);


      if(returnDataCleaned[0].length >=1) {
       return {success:"retornando dados do seu perfil para uso", dadosUsuario: returnDataCleaned[0][0],dadosPetsUsuario:returnPetsUser.dataResponse}
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
      if(verifyContactVinculate[0].length >=1) {
        saoAmigos = true;
      }else {
        saoAmigos = false
      }

      if(verifyInviteExistence[0].length >=1) {
        envioAmizadePendente = true;
      }else {
        envioAmizadePendente = false;
      }

      if(returnAnotherUserProfile[0].length >=1) {
        return {success: "retornando dados de perfil do usuário solicitado", dadosUsuario:returnAnotherUserProfile[0][0], dadosPetsUsuario:returnPetsOfThisUser.dataResponse, saoAmigos:saoAmigos,envioAmizadeFoiFeito:envioAmizadePendente}
      } else {
        return {error:"não foi possivel retornar dados do perfil do usuário especificado"}
      }
    }
   },

   async removeUsuarioDaListaDeContatosQuery (contactID,userID) {
    const conn = await connection();
    try{
      const verifyIfUserAreInContact = await conn.query("select * from contato where ID=? AND IDSolicitante=? OR ID=? AND IDDestinatario=?",[contactID,userID,contactID,userID])
      if(verifyIfUserAreInContact[0].length >=1) {
        const removingContact = await conn.query("delete from contato WHERE ID=?",[contactID])
        if(removingContact[0].affectedRows >=1) {
          return{success:"contato removido da sua lista de contatos com sucesso."}
        }else {
          return{error:"não foi possivel remover o contato da sua lista, tente novamente!"}
        }
      }else {
        return{error:"o usuário não pode remover o contato, pois não participa deste contato para geri-lo"}
      }
    }catch(e) {
      return{error:e.message}
    }
   },

   async meusContatosQuery (userID) {
    const conn = await connection();
 

    try{
      const getingMyContacts = await conn.query("SELECT u.Nome, c.ID as contatoID FROM usuario as u JOIN contato as c WHERE c.IDSolicitante=? AND c.Interessado = ? AND u.ID = C.IDDestinatario OR  c.IDDestinatario=? AND c.Interessado = ? AND u.ID= c.IDSolicitante ",[userID ,0,userID ,0])

      let unifyResultsNotInterest = []

      if(getingMyContacts[0].length >= 1) {
         getingMyContacts[0].forEach(e => {
         unifyResultsNotInterest.push(e)
         })
      }
      const getingMyContactsInterestedsInMyPet = await conn.query("SELECT u.Nome, c.ID as contatoID FROM usuario as u JOIN contato as c WHERE c.IDSolicitante=? AND c.Interessado = ? AND u.ID = C.IDDestinatario OR c.IDDestinatario=? AND c.Interessado = ? AND u.ID = C.IDSolicitante",[userID ,1,userID ,1])
      
      let unifyResultsInterestedsContacts = []

  
      if(getingMyContactsInterestedsInMyPet[0].length >=1) {
        getingMyContactsInterestedsInMyPet[0].forEach(e => {
          unifyResultsInterestedsContacts.push(e)
      })
      }

     const returnedMessages =  unifyResultsInterestedsContacts.map(async e => {
        const takeLastMessage = await conn.query("select * from mensagem where IDContato=? order by DataDeEnvio desc limit 1;",[e.contatoID])
        if(takeLastMessage[0].length >=1) {
          console.log(e)
          e.ultimaMensagem = takeLastMessage[0][0].Texto
          return e
        }else {
          e.ultimaMensagem = "não tem mensagens"
          return e
        }
      })

      const returnedMessagesNotInterest = unifyResultsNotInterest.map(async e => {
        const takeLastMessage = await conn.query("select * from mensagem where IDContato=? order by DataDeEnvio desc limit 1;",[e.contatoID])
        if(takeLastMessage[0].length >=1) {
          e.ultimaMensagem = takeLastMessage[0][0].Texto
          return e
        }else {
          e.ultimaMensagem = "não tem mensagens"
          return e
        }
      })

      unifyResultsInterestedsContacts= await Promise.all(returnedMessages)
      unifyResultsNotInterest = await Promise.all(returnedMessagesNotInterest)
     
      if(unifyResultsInterestedsContacts.length >= 1 || unifyResultsNotInterest.length >=1) {
        return {success: "retornando dados de todos seus contatos para o front end", contatosDeInteresses:unifyResultsInterestedsContacts, contatosSemInteresses:unifyResultsNotInterest}
      }

      return {error:"não há nenhum contato para ser retornado!"}
      
    }catch(e) {
      return{error:e.message}
    }
   },

   
}

module.exports = userInteractQueries;