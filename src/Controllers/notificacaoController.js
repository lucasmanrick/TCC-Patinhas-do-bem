const Notificacao = require("../Models/Class/Notificacao");



const notificacaoController  = {
  MinhasNotificacoes : async (req,res) => {
    const {ID} = req.dataUser;
    try{
     
      if(!ID) return {error:"não foi especificado o ID do usuário para ser pego as notificações do mesmo."}
      const getMyNotifications = await Notificacao.minhasNotificacoesQuery(ID);
      res.json(getMyNotifications)
    }catch(e) {
      res.json({error:e.message})
    }
  },
  
  marcarNotificacoesComoVisualizadas: async (req,res) => {
    const {ID} = req.dataUser;
    try {
      return res.json(await  Notificacao.marcarNotificacoesComoVisualizadasQuery(ID))
    }catch(e) {
      res.json({error:e.message})
    }
  }
}


module.exports = notificacaoController;