const { connection } = require("../../Config/db");
const Notificacao = require("./Notificacao");

class Denuncia {
  constructor (Causa,IDUsuario,IDPostagem) {
    this.Causa = Causa;
    this.IDUsuario = IDUsuario;
    this.IDPostagem = IDPostagem;
  }


   async denunciarPostagemQuery () {
    const conn = await connection();
    try {
      const verifyDenunciate = await conn.query ("select * from Denuncia where idUsuario = ? AND IDPostagem = ?", [this.IDUsuario,this.IDPostagem])
      if(verifyDenunciate[0].length >=1) return {error:"você já denunciou está postagem"}
      const denunciatePost = await conn.query("INSERT INTO Denuncia (Causa,IDUsuario,IDPostagem) VALUES (?,?,?)", [this.Causa,this.IDUsuario,this.IDPostagem])
      if(denunciatePost[0].affectedRows >=1){
        const verifyComplaintQuantity = await conn.query("SELECT * FROM Denuncia WHERE IDPostagem = ?",[this.IDPostagem])
        if(verifyComplaintQuantity[0].length >=5) {
          const newNotify = new Notificacao (null,"um usuário denunciou a postagem de ID " + this.IDPostagem,6,null,this.IDPostagem,0)  // no lugar do 6 inserir o ID DO ADMINISTRADOR DO SITE
          await newNotify.criarNotificação();
        }
        return {success:"postagem denunciada com sucesso"}
      } 
      return {error:"não foi possivel denunciar a postagem, 404"}
    }catch(e) {
      return {error:e.message}
    }
  }
}


module.exports = Denuncia