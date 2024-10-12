const { connection } = require("../../Config/db");


class Notificacao {
  constructor (ID,Texto,IDDestinatario,IDComentario,IDPostagem,Recebimento) {
    this.ID = ID;
    this.Texto = Texto;
    this.IDDestinatario = IDDestinatario;
    this.IDComentario = IDComentario;
    this.IDPostagem = IDPostagem;
    this.Recebimento = Recebimento
  }


 static async minhasNotificacoesQuery (userID) {
    const conn = await connection();
    console.log("teste")
    try {
      console.log(userID)
        const getMyNotifications = await conn.query("select ID as IDNotificacao, Texto, IDComentario, IDPostagem from notificacao WHERE IDDestinatario = ? AND Recebimento =? ",[userID,0])
        console.log(getMyNotifications)
        if(getMyNotifications[0].length >=1) {
          console.log("entrou")
          const updatingView = await conn.query("UPDATE notificacao SET Recebimento = ? WHERE IDDestinatario = ? ",[1,userID])
          if(updatingView[0].affectedRows >=1) {
            return {success:"retornando as notificações do usuário", notifications: getMyNotifications[0]}
          }else {
            return {error:"não é possivel retornar as notificações por uma falha no processo"} //não sofreu o update
          }
        }else {
          return {error:"não foi identificado notificações pendentes"}
        }
      }catch(e) {
      return {error:e.message}
    }
  }

}


module.exports = Notificacao;