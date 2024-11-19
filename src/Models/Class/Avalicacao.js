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
      //verifyEarlierReaction ve se a pessoa já não avaliou o post solicitado. (é mais uma validação para falha do front do que validação do usuário).
      const verifyEarlierReaction =  await conn.query("select * from avaliacao where IDUsuario=? AND IDPostagem = ?",[this.IDUsuario,this.IDPostagem])
      if(verifyEarlierReaction[0].length >=1) return {error:"você já avaliou este post"}
      
      // createAvaliation faz o insert da avaliação no banco de dados
      const createAvaliation = await conn.query("INSERT INTO avaliacao (tipo,IDPostagem,IDUsuario) VALUES (?,?,?)",[this.tipo,this.IDPostagem,this.IDUsuario])
      //verifyUserData faz a requisição para saber o nome de quem está avaliando e posteriormente enviar como notificação para o dono da postagem
      const verifyUserData = await conn.query("SELECT * from usuario where id=?",[this.IDUsuario])
      //verifyPostManager faz a analise de quem é o dono da postagem que está sendo avaliada para que a notificação va para a pessoa certa
      const verifyPostManager = await conn.query ("SELECT U.Nome, U.ID FROM USUARIO AS U JOIN postagem as P on P.IDUsuario = U.ID WHERE P.ID =?",[this.IDPostagem])
      if(createAvaliation[0].affectedRows >=1) { // se o insert no banco de dados da avaliação deu certo:
        const newNotify = new Notificacao (null,`${verifyUserData[0][0].Nome} reagiu a sua publicação`,verifyPostManager[0][0].ID,null,this.IDPostagem,0)
        await newNotify.criarNotificação(); // notifica ao usuário y que o usuário x reagiu a publicação.
        return {success:"você reagiu a publicação com sucesso"}
      }return {error:"não foi possivel reagir a publicação pois houve um erro no processo (404)"}
    }catch(e) {
      return {error:e.message}
    }
  }


  static async removerReacaoQuery (UserID,IDPostagem) {
    const conn = await connection();
    try {
     const deletingPost = await conn.query("DELETE FROM avaliacao where IDPostagem=? AND IDUsuario=?",[IDPostagem,UserID]);
     if(deletingPost[0].affectedRows >=1) {
      return {success:"você deixou de avaliar a postagem com sucesso"}
     }else {
      return {error:"não foi possivel deixar de avaliar a postagem por conta de um problema durante o processamento (404). tente novamente"}
     }
    }catch(e) {
      return {error:e.message}
    }
  }

  static async verReacoesPostagemQuery (IDPostagem) {
    const conn = await connection();
    try{
      if(!IDPostagem) {return{error:"você não informou o id da postagem"}}
      const bdRequesting = await conn.query("SELECT * FROM avaliacao WHERE IDPostagem = ?",[IDPostagem]);
      return bdRequesting
    }catch(e) {
      return {error:e.message}
    }
  }
  
}

module.exports = Avaliacao