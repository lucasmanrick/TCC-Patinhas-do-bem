const { connection } = require(`../../Config/db`);
const Notificacao = require("./Notificacao");


class Avaliacao {
  constructor (ID,tipo,IDPostagem,IDUsuario) {
    this.ID = ID;
    this.tipo = tipo;
    this.IDPostagem = IDPostagem;
    this.IDUsuario = IDUsuario
  }

  async reagirPostagemQuery () {
    const conn = await connection();
    try {
      const createAvaliation = await conn.query("INSERT INTO avaliacao (tipo,IDPostagem,IDUsuario) VALUES (?,?,?)",[this.tipo,this.IDPostagem,this.IDUsuario])
      const verifyUserData = await conn.query("SELECT * from usuario where id=?",[this.IDUsuario])
      const verifyPostManager = await conn.query ("SELECT U.Nome, U.ID FROM USUARIO AS U JOIN postagem as P on P.IDUsuario = U.ID WHERE P.ID =?",[this.IDPostagem])
      if(createAvaliation[0].affectedRows >=1) {
        const newNotify = new Notificacao (null,`${verifyUserData[0][0].Nome} reagiu a sua publicação`,verifyPostManager[0][0].ID,null,this.IDPostagem,0)
        await newNotify.criarNotificação();
        return {success:"você reagiu a publicação com sucesso"}
      }return {error:"não foi possivel reagir a publicação pois houve um erro no processo (404)"}
    }catch(e) {
      return {error:e.message}
    }
  }


  static async removerReacaoQuery (UserID,IDPostagem) {
    const conn = await connection();
    try {
     const deletingPost = await conn.query("DELETE FROM AVALIACAO where IDPostagem=? AND IDUsuario=?",[IDPostagem,UserID]);
     if(deletingPost[0].affectedRows >=1) {
      return {success:"você deixou de avaliar a postagem com sucesso"}
     }else {
      return {error:"não foi possivel deixar de avaliar a postagem por conta de um problema durante o processamento (404). tente novamente"}
     }
    }catch(e) {
      return {error:e.message}
    }
  }


  static async verReacoesEmUmPostQuery (postID) {
    const conn = await connection();
    try {
      const storageRequest = await conn.query ("SELECT * FROM AVALIACAO WHERE IDPostagem = ?",[postID])
      
    }catch(e) {
      return {error:e.message}
    }
  }
  
}

module.exports = Avaliacao