const { connection } = require(`../../Config/db`);

class SolicitacaoContato {
  constructor(ID,IDSolicitante,Interessado,IDDestinatario) {
    this.ID = ID
    this.IDSolicitante = IDSolicitante
    this.Interessado = Interessado
    this.IDDestinatario = IDDestinatario
  }

 
 static  async enviarSolicitacaoDeAmizadeQuery (UserID,IDDestinatario) {
    const conn = await connection();

    try {
      if(UserID === IDDestinatario) {
        return {error:"você não pode enviar solicitação de contato para si mesmo"}
      }
      const verifyFriendExistence = await conn.query ("select * from usuario WHERE ID =?", [IDDestinatario]);
      const existenceInvite = await conn.query ("select * from solicitacaocontato WHERE IDSolicitante =? AND IDDestinatario = ? OR IDSolicitante = ? AND IDDestinatario = ?", [UserID,IDDestinatario,IDDestinatario,UserID]);
      const existenceContact = await conn.query ("SELECT * from contato WHERE IDSolicitante =? AND IDDestinatario = ? OR IDSolicitante = ? AND IDDestinatario = ?",[UserID,IDDestinatario,IDDestinatario,UserID])

      if(verifyFriendExistence[0].length < 1) {
        return {error:"o usuário com quem você está tentando fazer amizade não existe ou não foi identificado tente novamente."}
      }

      if (existenceInvite[0].length >= 1 || existenceContact[0].length >=1) {
        return {error: "o usuário ou o destinatario já estão com uma solicitação de amizade pendente entre si, ou já estão na lista de contato um dos outros."}
      }else {
        const sendInviteToNewFriend = await conn.query("insert into solicitacaocontato (IDSolicitante,Interessado,IDDestinatario) VALUES (?,?,?)",[UserID,0,IDDestinatario])
        if(sendInviteToNewFriend[0].affectedRows >= 1) {
          await conn.query ("insert into Notificacao (Texto,IDDestinatario,Recebimento) VALUES (?,?,?)",["Você acaba de receber uma nova solicitação de amizade",IDDestinatario,0])
          return {success:"solicitação de amizade enviada ao usuário solicitado com sucesso"}
        }
        return {error:"não foi feito a solicitação de amizade, pois não foi afetado nenhuma linha do banco de dados"}
      }
    }catch (e) {
      return {error:e.message}
    }
   }

   static async removeSolicitacaoDeAmizadeQuery (solicitacaoID) {
    const conn = await connection();
    try {
      const removingInvite = await conn.query("delete from solicitacaocontato where id=?", [solicitacaoID])
      if(removingInvite[0].affectedRows >=1) {
        return{success:"solicitação de amizade removida com sucesso, se o usuário tem interesse em algum pet desse usuário o interesse irá permanecer."}
      }
        return {error:"não foi retirado a solicitação de amizade especificada, a mesma pode não existir ou já ter sido removida tente novamente"}
      
    }catch (e) {
      return {error:e.message}
    }
   }

   static async minhasSolicitacoesQuery (UserID) {
    const conn = await connection();
    try {
     const myInvites = await conn.query("select sc.ID,sc.IDSolicitante,sc.Interessado, u.Nome from solicitacaocontato as sc JOIN usuario as u WHERE IDDestinatario = ? AND u.ID = sc.IDSolicitante",[UserID,])
    if(myInvites[0].length >=1) {
      return {success:"retornando todas solicitações de contato enviadas para mim", invites:myInvites[0]}
    }else {
      return{error:"não foi identificado nenhuma solicitação de contato ou houve algum problema durante o processo."}
    }
    }catch(e) {
      return{error:e.message}
    }
   }

   static async aceitaSolicitacaoQuery (userID,inviteID) {
    const conn = await connection();
    try{

      if(userID && inviteID) {
        const verifyExistenceInvite = await conn.query("select * from solicitacaocontato WHERE IDDestinatario = ? && ID=?",[userID,inviteID]);
        if(verifyExistenceInvite[0].length >=1) {
          const acceptInvite = await conn.query("insert into contato (Data,IDSolicitante,Interessado,IDDestinatario) VALUES (?,?,?,?)",[new Date(),verifyExistenceInvite[0][0].IDSolicitante,verifyExistenceInvite[0][0].Interessado,verifyExistenceInvite[0][0].IDDestinatario])
          console.log(acceptInvite)
          if(acceptInvite[0].affectedRows >= 1) {
            const deleteInviteExistence = await conn.query("DELETE from solicitacaocontato WHERE ID=?",[verifyExistenceInvite[0][0].ID])
            if(deleteInviteExistence[0].affectedRows >=1) {
              return{success:"você aceitou a solicitação de amizade com sucesso!"}
            }else {
              return{error:"não foi possivel aceitar a solicitação de amizade, tente novamente!"}
            }
          }else {
            return{error:"não foi possivel tornar o usuário um de seus contatos"}
          }
        }else {
          return{error:"esta solicitação de amizade já não existe ou não foi identificada, tente novamente"}
        }
      }
    }catch(e) {
      return {error:e.message}
    }
   }

}


module.exports = SolicitacaoContato;