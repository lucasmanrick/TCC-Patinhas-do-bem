const { connection } = require("../../Config/db");
const { connect } = require("../../Routes/routesapp");

class Notificacao {
  constructor (ID,Texto,IDDestinatario,IDComentario,IDPostagem,Recebimento) {
    this.ID = ID;
    this.Texto = Texto;
    this.IDDestinatario = IDDestinatario;
    this.IDComentario = IDComentario;
    this.IDPostagem = IDPostagem;
    this.Recebimento = Recebimento
  }


  async minhasNotificacoesQuery (userID) {
    const conn = await connection();
    try {
        const getMyNotifications = await conn.query("select * from notificacoes WHERE IDDestinatario = ?",[userID])
    }catch(e) {
      return {error:e.message}
    }
  }

}


module.exports = Notificacao;