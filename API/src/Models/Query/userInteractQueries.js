const {connection} = require('../../Config/db');
const petQueries = require('./petQueries');

const userInteractQueries = {
  async enviarSolicitacaoDeAmizadeQuery (UserID,IDDestinatario) {
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
          return {sucess:"solicitação de amizade enviada ao usuário solicitado com sucesso"}
        }
      }
    }catch (e) {
      return {error:e}
    }
   },

   async removeSolicitacaoDeAmizadeQuery (solicitacaoID) {
    const conn = await connection();
    try {
      const removingInvite = await conn.query("delete from solicitacaocontato where id=?", [solicitacaoID])
      if(removingInvite[0].affectedRows >=1) {
        return{sucess:"solicitação de amizade removida com sucesso, se o usuário tem interesse em algum pet desse usuário o interesse irá permanecer."}
      }
        return {error:"não foi retirado a solicitação de amizade especificada, a mesma pode não existir ou já ter sido removida tente novamente"}
      
    }catch (e) {
      return {error:e}
    }
   },
   async minhasSolicitacoesQuery (UserID) {
    const conn = await connection();
    try {
     const myInvites = await conn.query("select sc.ID,sc.IDSolicitante,sc.Interessado, u.Nome from solicitacaocontato as sc JOIN usuario as u WHERE IDDestinatario = ? AND u.ID = sc.IDSolicitante",[UserID,])
    if(myInvites[0].length >=1) {
      return {sucess:"retornando todas solicitações de contato enviadas para mim", invites:myInvites[0]}
    }else {
      return{error:"não foi identificado nenhuma solicitação de contato ou houve algum problema durante o processo."}
    }
    }catch(e) {
      return{error:e}
    }
   },

   async ProfileUserQuery(usuarioASerRetornado, userID) {
    const conn = await connection();



    if (userID && !usuarioASerRetornado) { // se o usuário solicitou analise de algum perfil e não passou id será retornado as informações dele mesmo, caso ele passe id sera pego os dados do usuário solicitado.
      //returnDataCleaned pega os dados (que podem ser vistos) do usuário que será visto o perfil.
      const returnDataCleaned = await conn.query("select u.Nome, u.CEP, u.Rua, u.Numero, u.Bairro, u.Estado, u.DataNasc,u.Cidade, u.Email  from usuario As u WHERE id=? ",[userID]);   
      const returnPetsUser = await petQueries.petsDeUmUsuarioQuery(userID)

      console.log(returnDataCleaned[0][0])

      if(returnDataCleaned[0].length >=1 && returnPetsUser.sucess != null) {
       return {sucess:"retornando dados do seu perfil para uso", dadosUsuario: returnDataCleaned[0][0],dadosPetsUsuario:returnPetsUser.dataResponse}
      }else {
        return{error:"não foi possivel retornar dados do seu perfil, tente novamente por favor"}
      }

    } else { // se o usuário quiser ver o perfil de outra pessoa
      const returnAnotherUserProfile = await conn.query ("select")
    }
   }
}

module.exports = userInteractQueries;