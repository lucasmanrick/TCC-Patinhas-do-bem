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

    }catch(e) {
      return {error:e.message}
    }
  }
}


module.exports = Postagem