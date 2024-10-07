const {connection} = require('../../Config/db');
const petQueries = require('./petQueries');

const userInteractQueries = {
  async enviarSolicitacaoDeAmizadeQuery (UserID,IDDestinatario) {
    const conn = await connection();

    try {
      if(UserID === IDDestinatario) {
        return {error:"você não pode enviar solicitação de contato para si mesmo"}
      }
      const verifyFriendExistence = await conn.query ("select * from usuario WHERE ID =?", [IDDestinatario]);
      const existenceInvite = await conn.query ("select * from solicitacaocontato WHERE IDSolicitante =? AND IDDestinatario = ? OR IDSolicitante = ? AND IDDestinatario = ?", [UserID,IDDestinatario,IDDestinatario,UserID]);
      const existenceContact = await conn.query ("SELECT * from contato WHERE IDSolicitante =? AND IDDestinatario = ? OR IDSolicitante = ? AND IDDestinatario = ?",[UserID,IDDestinatario,IDDestinatario,UserID])

      if(verifyFriendExistence[0].length < 1) {
        return {error:"o usuário com quem você está tentando fazer amizade não existe ou não foi identificado tente novamente."}
      }

      if (existenceInvite[0].length >= 1 || existenceContact[0].length >=1) {
        return {error: "o usuário ou o destinatario já estão com uma solicitação de amizade pendente entre si, ou já estão na lista de contato um dos outros."}
      }else {
        const sendInviteToNewFriend = await conn.query("insert into solicitacaocontato (IDSolicitante,Interessado,IDDestinatario) VALUES (?,?,?)",[UserID,0,IDDestinatario])
        if(sendInviteToNewFriend[0].affectedRows >= 1) {
          return {sucess:"solicitação de amizade enviada ao usuário solicitado com sucesso"}
        }
      }
    }catch (e) {
      return {error:e.message}
    }
   },

   async removeSolicitacaoDeAmizadeQuery (solicitacaoID) {
    const conn = await connection();
    try {
      const removingInvite = await conn.query("delete from solicitacaocontato where id=?", [solicitacaoID])
      if(removingInvite[0].affectedRows >=1) {
        return{sucess:"solicitação de amizade removida com sucesso, se o usuário tem interesse em algum pet desse usuário o interesse irá permanecer."}
      }
        return {error:"não foi retirado a solicitação de amizade especificada, a mesma pode não existir ou já ter sido removida tente novamente"}
      
    }catch (e) {
      return {error:e.message}
    }
   },
   async minhasSolicitacoesQuery (UserID) {
    const conn = await connection();
    try {
     const myInvites = await conn.query("select sc.ID,sc.IDSolicitante,sc.Interessado, u.Nome from solicitacaocontato as sc JOIN usuario as u WHERE IDDestinatario = ? AND u.ID = sc.IDSolicitante",[UserID,])
    if(myInvites[0].length >=1) {
      return {sucess:"retornando todas solicitações de contato enviadas para mim", invites:myInvites[0]}
    }else {
      return{error:"não foi identificado nenhuma solicitação de contato ou houve algum problema durante o processo."}
    }
    }catch(e) {
      return{error:e.message}
    }
   },

   async aceitaSolicitacaoQuery (userID,inviteID) {
    const conn = await connection();
    try{

      if(userID && inviteID) {
        const verifyExistenceInvite = await conn.query("select * from solicitacaocontato WHERE IDDestinatario = ? && ID=?",[userID,inviteID]);
        if(verifyExistenceInvite[0].length >=1) {
          const acceptInvite = await conn.query("insert into contato (Data,IDSolicitante,Interessado,IDDestinatario) VALUES (?,?,?,?)",[new Date(),verifyExistenceInvite[0][0].IDSolicitante,verifyExistenceInvite[0][0].Interessado,verifyExistenceInvite[0][0].IDDestinatario])
          console.log(acceptInvite)
          if(acceptInvite[0].affectedRows >= 1) {
            const deleteInviteExistence = await conn.query("DELETE from solicitacaocontato WHERE ID=?",[verifyExistenceInvite[0][0].ID])
            if(deleteInviteExistence[0].affectedRows >=1) {
              return{sucess:"você aceitou a solicitação de amizade com sucesso!"}
            }else {
              return{error:"não foi possivel aceitar a solicitação de amizade, tente novamente!"}
            }
          }else {
            return{error:"não foi possivel tornar o usuário um de seus contatos"}
          }
        }else {
          return{error:"esta solicitação de amizade já não existe ou não foi identificada, tente novamente"}
        }
      }
    }catch(e) {
      return {error:e.message}
    }
   },

   async profileUserQuery(usuarioASerRetornado, userID) {
    const conn = await connection();



    if (userID && !usuarioASerRetornado) { // se o usuário solicitou analise de algum perfil e não passou id será retornado as informações dele mesmo, caso ele passe id sera pego os dados do usuário solicitado.
      //returnDataCleaned pega os dados (que podem ser vistos) do usuário que será visto o perfil.
      const returnDataCleaned = await conn.query("select u.Nome, u.CEP, u.Rua, u.Numero, u.Bairro, u.Estado, u.DataNasc,u.Cidade, u.Email  from usuario As u WHERE id=? ",[userID]);   
      const returnPetsUser = await petQueries.petsDeUmUsuarioQuery(userID);


      if(returnDataCleaned[0].length >=1) {
       return {sucess:"retornando dados do seu perfil para uso", dadosUsuario: returnDataCleaned[0][0],dadosPetsUsuario:returnPetsUser.dataResponse}
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
        return {sucess: "retornando dados de perfil do usuário solicitado", dadosUsuario:returnAnotherUserProfile[0][0], dadosPetsUsuario:returnPetsOfThisUser.dataResponse, saoAmigos:saoAmigos,envioAmizadeFoiFeito:envioAmizadePendente}
      } else {
        return {error:"não foi possivel retornar dados do perfil do usuário especificado"}
      }
    }
   },

   async removeDadosUsuarioQuery(UsuarioRequisitorID,UsuarioASerRemovido) {
    const conn = await connection();
    try{
      if(UsuarioRequisitorID && UsuarioASerRemovido) {
        const deletingSomeUser = await conn.query("DELETE FROM usuario WHERE ID=?",[UsuarioASerRemovido]);
       
        if(deletingSomeUser[0].affectedRows >=1) {
          return {sucess:"usuário removido por completo do sistema"}
        }
      } else if (UsuarioRequisitorID && !UsuarioASerRemovido) {
        const deletingYourselfProfile = await conn.query("DELETE FROM usuario WHERE id=?",[UsuarioRequisitorID])
        if(deletingYourselfProfile[0].affectedRows >=1) {
          return {sucess:"seu perfil foi deletado com sucesso de nosso sistema!."}
        }
      }
    }catch(e) {
      return {error:e.message}
    }
   },

   async editaDadosCadastraisQuery (userForm) {
    const conn = await connection();
    try{                                               
      const sendToDBRefreshUserData = await conn.query("UPDATE usuario SET Nome = ?, CEP=?, Rua=?, Numero=?, Bairro=?, Estado=?, DataNasc=?, Email=?, Senha=?,Cidade=? WHERE ID=?",[userForm.NomeUsuario,userForm.Cep,userForm.Rua,userForm.Numero,userForm.Bairro,userForm.Estado,userForm.DataNasc,userForm.Email,userForm.Senha,userForm.Cidade,userForm.ID])
      if(sendToDBRefreshUserData[0].affectedRows >=1) {
        return{sucess:"atualizado os dados do usuário com sucesso"}
      }else {
        return{error:"não foi possivel atualizar os dados do usuário, tente novamente!"}
      }
    }catch(e) {
      return{error:e.message}
    }
   },

   async removeUsuarioDaListaDeContatosQuery (contactID,userID) {
    const conn = await connection();
    try{
      const verifyIfUserAreInContact = await conn.query("select * from contato where ID=? AND IDSolicitante=? OR ID=? AND IDDestinatario=?",[contactID,userID,contactID,userID])
      if(verifyIfUserAreInContact[0].length >=1) {
        const removingContact = await conn.query("delete from contato WHERE ID=?",[contactID])
        if(removingContact[0].affectedRows >=1) {
          return{sucess:"contato removido da sua lista de contatos com sucesso."}
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
      const getingMyContacts = await conn.query("SELECT u.Nome, c.ID as contatoID FROM usuario as u JOIN contato as c WHERE u.ID=? AND c.IDSolicitante=? AND c.Interessado = ? OR u.ID=? AND c.IDDestinatario=? AND c.Interessado = ? ",[userID,userID ,0,userID,userID ,0])

      let unifyResultsNotInterest = []

      if(getingMyContacts[0].length >= 1) {
         getingMyContacts[0].forEach(e => {
         unifyResultsNotInterest.push(e)
         })
      }
      const getingMyContactsInterestedsInMyPet = await conn.query("SELECT u.Nome, c.ID as contatoID FROM usuario as u JOIN contato as c WHERE u.ID=? AND c.IDSolicitante=? AND c.Interessado = ? OR u.ID=? AND c.IDDestinatario=? AND c.Interessado = ?",[userID,userID ,1,userID,userID ,1])
      
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
        return {sucess: "retornando dados de todos seus contatos para o front end", contatosDeInteresses:unifyResultsInterestedsContacts, contatosSemInteresses:unifyResultsNotInterest}
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
        return {sucess:"retornando todas mensagens com o contato solicitado", messages: getingMessages[0]}
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
          return {sucess:"mensagem enviada com sucesso"}
        }
      }  return {error:"o usuário não faz parte do contato do qual está tentando enviar mensagem"}
  } catch(e) {
    return {error:e.message}
  }
  },


  async deletaMensagemEnviadaQuery (userID,MessageID) {
    const conn = await connection();
    try{
      const deletingMessageRequisited = await conn.query("UPDATE Mensagem SET Remocao=1 WHERE ID=? AND IDRemetente=?",[MessageID,userID])
      if(deletingMessageRequisited[0].affectedRows >=1) return{sucess:"mensagem removida com sucesso"}
      return{error:"não foi removida a mensagem solicitada, pois ela não pertence a você, ou já foi removida"}
    }catch(e) {
      return {error:e.message}
    }
  }
}

module.exports = userInteractQueries;