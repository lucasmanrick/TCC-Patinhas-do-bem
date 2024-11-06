const { connection } = require("../../Config/db");


class Notificacao {
  #Texto;
  #IDDestinatario;
  #IDComentario;
  #IDPostagem;
  #Recebimento
  constructor (ID,Texto,IDDestinatario,IDComentario,IDPostagem,Recebimento) {
    this.ID = ID?ID:null;
    this.#Texto = Texto;
    this.#IDDestinatario = IDDestinatario;
    this.#IDComentario = IDComentario?IDComentario:null;
    this.#IDPostagem = IDPostagem?IDPostagem:null;
    this.#Recebimento = Recebimento?Recebimento:0;
  }


  async criarNotificação () {
    const conn = await connection();
    try {
      if(this.#Texto,this.#IDDestinatario) {

        const sendingNotify = await conn.query("INSERT INTO notificacao (Texto,IDDestinatario,IDComentario,IDPostagem,Recebimento) VALUES (?,?,?,?,?)", [this.#Texto,this.#IDDestinatario,this.#IDComentario,this.#IDPostagem,this.#Recebimento])
        if(sendingNotify[0].affectedRows >=1) return {success:"notificação registrada com sucesso"}
        return {error:"não foi feito a inserção da notificação por favor tente novamente."}
      }
    } 
    catch(e) {
      return {error:e.message}
    }
  }


 static async minhasNotificacoesQuery (userID) {
    const conn = await connection();
    try {
        const getMyNotifications = await conn.query("select ID as IDNotificacao, Texto, IDComentario, IDPostagem, Recebimento as MensagemVisualizada from notificacao WHERE IDDestinatario = ? LIMIT 10",[userID])
        getMyNotifications[0].forEach (e => {
          e.MensagemVisualizada === 1?e.MensagemVisualizada = "True":e.MensagemVisualizada = "False"
        })
        if(getMyNotifications[0].length >=1) {
            return {success:"retornando as notificações do usuário", notifications: getMyNotifications[0]}
        }else {
          return {error:"não foi identificado notificações pendentes"}
        }
      }catch(e) {
      return {error:e.message}
    }
  }

  static async marcarNotificacoesComoVisualizadasQuery (userID) {
    const conn = await connection();
    try {
      const updatingView = await conn.query("UPDATE notificacao SET Recebimento = ? WHERE IDDestinatario = ? ",[1,userID])
     if(updatingView[0].affectedRows >= 1) {
      return {success:"notificações marcadas como visualizada"}
     }return {error:"não foi possivel marcar as notificações como visualizadas, por favor tente novamente."}
    }
    catch(e) {
      return {error:e.message}
    }
  }




}


module.exports = Notificacao;