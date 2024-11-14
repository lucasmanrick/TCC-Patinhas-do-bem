const { connection } = require("../../Config/db");
const { profileUserQuery } = require("../Query/userInteractQueries");


class Comentario {
  constructor(ID, Texto, Data, IDPostagem, IDUsuario) {
    this.ID = ID;
    this.Texto = Texto;
    this.Data = Data;
    this.IDPostagem = IDPostagem;
    this.IDUsuario = IDUsuario
  }
  async comentarEmUmPostQuery() {
    const conn = await connection();
    try {
      const createComment = await conn.query("insert into comentario (Texto,Data,IDPostagem,IDUsuario) VALUES (?,?,?,?)",[this.Texto,this.Data,this.IDPostagem,this.IDUsuario])
      if(createComment[0].affectedRows >= 1) return {success:"comentario efetuado com sucesso"}
      return {error:"não foi possivel efetuar o comentario por favor tente novamente"}
    } catch (e) {
      return { error: e.message }
    }
  }

  static async verComentariosDeUmPostQuery (IDPost) { // função de uso interno (é utilizada na hora de retornar as postagens, ou seja não é acessada pelo cliente/usuario)
    const conn = await connection();
    try{ 
      const getComments = await conn.query("select u.Nome , c.ID as IDComentario, c.Texto, c.Data, c.IDUsuario  from comentario as c join usuario as u on u.ID = c.IDUsuario where IDPostagem = ?",[IDPost])
      return getComments
    }catch(e) {
      return {error:e.message}
    }
  }
}

module.exports = Comentario