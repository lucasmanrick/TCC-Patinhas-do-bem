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
      const getingMyContacts = await conn.query("SELECT u.ID as IDUsuario, u.Nome, c.ID as contatoID FROM usuario as u JOIN contato as c WHERE c.IDSolicitante=? AND c.Interessado = ? AND u.ID = c.IDDestinatario OR  c.IDDestinatario=? AND c.Interessado = ? AND u.ID= c.IDSolicitante ",[userID ,0,userID ,0])

      console.log(getingMyContacts)
      let unifyResultsNotInterest = []

      if(getingMyContacts[0].length >= 1) {
         getingMyContacts[0].forEach(e => {
         unifyResultsNotInterest.push(e)
         })
      }
      const getingMyContactsInterestedsInMyPet = await conn.query("SELECT u.ID as IDUsuario,u.Nome, c.ID as contatoID FROM usuario as u JOIN contato as c WHERE c.IDSolicitante=? AND c.Interessado = ? AND u.ID = c.IDDestinatario OR c.IDDestinatario=? AND c.Interessado = ? AND u.ID = c.IDSolicitante",[userID ,1,userID ,1])
      
      let unifyResultsInterestedsContacts = []

  
      if(getingMyContactsInterestedsInMyPet[0].length >=1) {
        getingMyContactsInterestedsInMyPet[0].forEach(e => {
          unifyResultsInterestedsContacts.push(e)
      })
      }

     const returnedMessages =  unifyResultsInterestedsContacts.map(async e => {
        const takeLastMessage = await conn.query("select * from mensagem where IDContato=? order by DataDeEnvio desc limit 1;",[e.contatoID])
        if(takeLastMessage[0].length >=1) {
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


   
}


module.exports = Contato