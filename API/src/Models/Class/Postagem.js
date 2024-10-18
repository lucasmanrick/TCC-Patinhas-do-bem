const { connection } = require("../../Config/db");


class Postagem {
  constructor (ID,Descricao,dataPublicacao,IDUsuario) {
      this.ID = ID === null? null:ID;
      this.Descricao = Descricao;
      this.dataPublicacao = dataPublicacao
      this.IDUsuario = IDUsuario
  }

  async criarPostagemQuery () {
    const conn = await connection();
    try {
      const creatingPost = await conn.query("INSERT INTO Postagem (Descricao,dataPublicacao,IDUsuario) VALUES (?,?,?)", [this.Descricao,this.dataPublicacao,this.IDUsuario])
      if(creatingPost[0].affectedRows >=1) {
        return {success:"você fez sua postagem com sucesso", idPostagem: creatingPost[0].insertId}
      } return {error:"não foi possivel criar sua postagem por favor tente novamente 404"}
    }
    catch(e) {
      return {error:e.message}
    }
  }


  async editarPostagemQuery () {
    const conn = await connection();
    try {
      const editingPost = await conn.query("UPDATE postagem SET Descricao = ? IDUsuario =? WHERE ID = ? AND IDUsuario = ?" [this.Descricao,this.IDUsuario,this.ID,this.IDUsuario])
      if(editingPost[0].affectedRows >=1) {
        return {success:"dados atualizados com sucesso"}
      }return {error:"não foi possivel atualizar os dados erro 404"}
    }catch(e) {
      return {error:e.message}
    }
  }


  static async verPostagensQuery (gapQuantity,UserID) {
    const conn = await connection();
    try{
      const getingPosts = await conn.query (`select p.*, u.Nome as NomeUsuario from postagem AS p JOIN contato AS C JOIN Usuario AS U on U.ID = p.IDUsuario WHERE C.IDSolicitante=? AND C.IDDestinatario=p.IDUsuario OR C.IDDestinatario=? AND C.IDSolicitante=p.IDUsuario  ORDER BY dataPublicacao DESC LIMIT 50 OFFSET ${50 * gapQuantity}`,[UserID,UserID]);
      return{success:"retornando posts de seus amigos",posts:getingPosts[0]}
    }catch(e) {
      return {error:e.message}
    }
  }
}


module.exports = Postagem