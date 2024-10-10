const { connection } = require(`../../Config/db`);

class Contato {
  constructor (ID,Data,IDSolicitante,Interessado,IDDestinatario) {
    this.ID = ID;
    this.Data = Data;
    this.IDSolicitante = IDSolicitante;
    this.Interessado = Interessado;
    this.IDDestinatario = IDDestinatario;
  }


 static async removeUsuarioDaListaDeContatosQuery (contactID,userID) {
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
   }

  static async meusContatosQuery (userID) {
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
   }

   static async mensagensContatoQuery (userID, contactID) {
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
   }

   static async enviaMensagemQuery (DataDeEnvio,IDRemetente,IDContato,Texto) {
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
  }


  static async deletaMensagemEnviadaQuery (userID,MessageID) {
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


module.exports = Contato