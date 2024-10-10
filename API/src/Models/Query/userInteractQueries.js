const {connection} = require('../../Config/db');

const userInteractQueries = {
 

   async profileUserQuery(usuarioASerRetornado, userID) {
    const conn = await connection();



    if (userID && !usuarioASerRetornado) { // se o usuário solicitou analise de algum perfil e não passou id será retornado as informações dele mesmo, caso ele passe id sera pego os dados do usuário solicitado.
      //returnDataCleaned pega os dados (que podem ser vistos) do usuário que será visto o perfil.
      const returnDataCleaned = await conn.query("select u.Nome, u.CEP, u.Rua, u.Numero, u.Bairro, u.Estado, u.DataNasc,u.Cidade, u.Email  from usuario As u WHERE id=? ",[userID]);   
      const returnPetsUser = await petQueries.petsDeUmUsuarioQuery(userID);


      if(returnDataCleaned[0].length >=1) {
       return {success:"retornando dados do seu perfil para uso", dadosUsuario: returnDataCleaned[0][0],dadosPetsUsuario:returnPetsUser.dataResponse}
      }else {
        return{error:"não foi possivel retornar dados do seu perfil, tente novamente por favor"}
      }

    } else { // se o usuário quiser ver o perfil de outra pessoa
      const returnAnotherUserProfile = await conn.query ("select u.Nome, u.Bairro, u.Estado, u.DataNasc,u.Cidade from usuario As u WHERE id=? ",[usuarioASerRetornado]);
      const returnPetsOfThisUser = await petQueries.petsDeUmUsuarioQuery(usuarioASerRetornado);
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

   async mensagensContatoQuery (userID, contactID) {
    const conn = await connection();
    try {
      const verifyIfUserAreInContact = await conn.query("select * from contato where ID=? AND IDSolicitante=? OR ID=? AND IDDestinatario=?",[contactID,userID,contactID,userID])
      if(verifyIfUserAreInContact[0].length >=1) {
        const getingMessages = await conn.query("select ID as IDMensagem, DataDeEnvio, IDRemetente as quemEnviouAMensagem , Texto from mensagem WHERE IDContato = ? AND Remocao = ?",[contactID,0])
        if(getingMessages[0].length >= 1) {
          getingMessages[0].sort((a,b) => {
            return a - b
          }
        ) 
        getingMessages[0].forEach(e => {
          if(e.quemEnviouAMensagem === userID) {
            e.quemEnviouAMensagem = "Você Enviou"
          }else {
            e.quemEnviouAMensagem = "Enviado pelo contato"
          }
        })
        return {success:"retornando todas mensagens com o contato solicitado", messages: getingMessages[0]}
        }else {
          return{error:"não possui nenhuma mensagem com o contato especificado"}
        }
      }else {
        return {error:"o usuário não faz parte do contato do qual está tentando enviar mensagem"}
      }
    }catch(e) {
      return{error:e.message}
    }
   },

  async enviaMensagemQuery (DataDeEnvio,IDRemetente,IDContato,Texto) {
    const conn = await connection();
    try {
      const verifyIfUserAreInContact = await conn.query("select * from contato where ID=? AND IDSolicitante=? OR ID=? AND IDDestinatario=?",[IDContato,IDRemetente,IDContato,IDRemetente])
      if(verifyIfUserAreInContact[0].length >=1) {
        const sendingMessage = await conn.query("INSERT INTO mensagem (DataDeEnvio,IDRemetente,IDContato,Remocao,Texto) VALUES (?,?,?,?,?)", [DataDeEnvio,IDRemetente,IDContato,0,Texto])
        if(sendingMessage[0].affectedRows >=1) {
          return {success:"mensagem enviada com sucesso"}
        }
      }  return {error:"o usuário não faz parte do contato do qual está tentando enviar mensagem"}
  } catch(e) {
    return {error:e.message}
  }
  },


  async deletaMensagemEnviadaQuery (userID,MessageID) {
    const conn = await connection();
    try{
      const deletingMessageRequisited = await conn.query("UPDATE Mensagem SET Remocao=1 WHERE ID=? AND IDRemetente=? AND Remocao=0",[MessageID,userID])
      if(deletingMessageRequisited[0].affectedRows >=1)return{success:"mensagem removida com sucesso"}
      return {error:"não foi removida a mensagem solicitada, pois ela não pertence a você, ou já foi removida"}
    }catch(e) {
      return {error:e.message}
    }
  }
}

module.exports = userInteractQueries;