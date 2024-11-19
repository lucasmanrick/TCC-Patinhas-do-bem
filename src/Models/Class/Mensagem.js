const { connection } = require("../../Config/db");






class Mensagem {
  constructor (ID,DataDeEnvio,IDRemetente,IDContato,Remocao,Texto) {
    this.ID = ID;
    this.DataDeEnvio = DataDeEnvio;
    this.IDRemetente = IDRemetente;
    this.IDContato = IDContato;
    this.Remocao = Remocao;
    this.Texto = Texto;
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

        return {success:"retornando todas mensagens com o contato solicitado", messages: getingMessages[0], contactID:contactID}
        }else {
          return{error:"não possui nenhuma mensagem com o contato especificado"}
        }
      }else {
        return {error:"o usuário não faz parte do contato do qual está tentando puxar mensagens"}
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
          return {success:"mensagem enviada com sucesso", idMensagem:sendingMessage[0].insertId}
        }
      }  return {error:"o usuário não faz parte do contato do qual está tentando enviar mensagem"}
  } catch(e) {
    return {error:e.message}
  }
  }


  static async deletaMensagemEnviadaQuery (userID,MessageID) {
    const conn = await connection();
    try{
      const deletingMessageRequisited = await conn.query("UPDATE mensagem SET Remocao=1 WHERE ID=? AND IDRemetente=? AND Remocao=0",[MessageID,userID])
      if(deletingMessageRequisited[0].affectedRows >=1)return{success:"mensagem removida com sucesso"}
      return {error:"não foi removida a mensagem solicitada, pois ela não pertence a você, ou já foi removida"}
    }catch(e) {
      return {error:e.message}
    }
  }
}

module.exports = Mensagem