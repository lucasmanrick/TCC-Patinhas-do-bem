const Notificacao = require("../Models/Class/Notificacao");



const notificacaoController  = {
  MinhasNotificacoes : async (req,res) => {
    const {ID} = req.dataUser;
    try{
      if(!ID) return {error:"não foi especificado o ID do usuário para ser pego as notificações do mesmo."}

      const getMyNotifications = await Notificacao.minhasNotificacoes
    }catch(e) {
      return {error:e.message}
    }
  }

}


module.exports = notificacaoController;