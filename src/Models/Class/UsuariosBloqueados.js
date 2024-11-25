const { connection } = require("../../Config/db");
const Usuario = require("./Usuario");


class UsuariosBloqueados {
  constructor (ID,dataBloqueio,IDBloqueado,IDBloqueador) {
    this.ID = ID
    this.dataBloqueio = dataBloqueio;
    this.IDBloqueado = IDBloqueado;
    this.IDBloqueador = IDBloqueador
  }

 static async pegaUsuarioBloqueadoPeloIDQuery (UserID) {
    const conn = await connection();
    try{
      if(!UserID) return {error:"você não informou o ID do usuário"}
      const verifyUserBlockQuery = await conn.query ("select * from UsuariosBloqueados WHERE IDBloqueado = ?", [UserID]);
      if (verifyUserBlockQuery[0].length >=1) return {warning:"o usuário que você inseriu se encontra bloqueado"}
      return {success:"o usuário que você inseriu não está bloqueado"}
    }catch(e) {
      return {error:e.message}
    }
  }


  static async retirarBloqueioUsuarioQuery (UserID, IDBloqueado) {
    const conn = await connection();
    try {
      const checkPermissionUser = await  Usuario.verificaPermissaoAdmQuery(UserID);
      if(checkPermissionUser.success) {
        const removingBlockUser = await conn.query("DELETE FROM UsuariosBloqueados WHERE IDBloqueado = ?",[IDBloqueado])
        if(removingBlockUser[0].length >=1) {
          return {success: "bloqueio removido com sucesso"}
        }
        return {error:"não foi possivel remover o bloqueio ao usuário, por favor tente novamente"}
      }
      
    }catch(e) {
      return {error:e.message}
    }
  }
}


module.exports = UsuariosBloqueados;