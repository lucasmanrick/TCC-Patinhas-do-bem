const userInteractQueries = require("../Models/Query/userInteractQueries");



const userInteractController = {
  enviarSolicitacaoDeAmizade: async (req,res) => {
    try{
      const {ID} = req.dataUser;
      const {IDDestinatario} = req.body;

      console.log(IDDestinatario)

      if(ID,IDDestinatario && typeof(IDDestinatario) === 'number') {
        const requestInvite = await userInteractQueries.enviarSolicitacaoDeAmizadeQuery(ID,IDDestinatario);
        res.json(requestInvite)
      }

    }
    catch(e) {
      res.json({error:e})
    }
  },

  removeSolicitacaoDeAmizade: async (req,res) => {
    try{
      const {inviteID} = req.body;

      if(inviteID) {
        const sendRemoveRequisition = await userInteractQueries.removeSolicitacaoDeAmizadeQuery(inviteID);
        res.json(sendRemoveRequisition)
      }else {
        res.json({error:"você não especificou uma solicitação de amizade que há de ser excluida."})
      }
    }catch (e) {
      res.json({error:e})
    }
  },

  minhasSolicitacoes: async(req,res) => {
    try{
      const {ID} = req.dataUser;

      if(ID) {
        const getMyInvites = await userInteractQueries.minhasSolicitacoesQuery(ID)
        res.json(getMyInvites)
      }
    }
    catch(e) {
      res.json({error:e})
    }
  },


  ProfileUser: async(req,res) => {
    const {ID} = req.dataUser;
    try {
      const {userBeReturnedID} = req.body;


      if(userBeReturnedID) {
        const dataReturnUserEspecified = await userInteractQueries.ProfileUserQuery(userBeReturnedID,ID)
        res.json(dataReturnUserEspecified)
      }else {
        const dataReturnUser = await userInteractQueries.ProfileUserQuery(null,ID)
        res.json(dataReturnUser)
      }
    }
    catch(e) {
      res.json({error:e})
    }
  }
}

module.exports = userInteractController