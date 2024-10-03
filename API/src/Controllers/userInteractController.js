const Usuario = require("../Models/Class/Usuario");
const userInteractQueries = require("../Models/Query/userInteractQueries");
const bcrypt = require('bcrypt');


const userInteractController = {
  enviarSolicitacaoDeAmizade: async (req,res) => {
    try{
      const {ID} = req.dataUser;
      const {IDDestinatario} = req.body;

      console.log(IDDestinatario)

      if(ID && IDDestinatario && typeof(IDDestinatario) === 'number') {
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

  aceitaSolicitacao: async(req,res) => {
    const {ID} = req.dataUser;
    const {inviteID} = req.body;
    try {
      if(ID && inviteID) {
        const acceptInviteRequest = await userInteractQueries.aceitaSolicitacaoQuery(ID,inviteID);
        res.json(acceptInviteRequest)
      }
    }catch(e) {
      res.json({error:e})
    }
  },

  profileUser: async(req,res) => {
    const {ID} = req.dataUser;
    try {
      const {userBeReturnedID} = req.body;


      if(userBeReturnedID) {
        const dataReturnUserEspecified = await userInteractQueries.profileUserQuery(userBeReturnedID,ID)
        res.json(dataReturnUserEspecified)
      }else {
        const dataReturnUser = await userInteractQueries.profileUserQuery(null,ID)
        res.json(dataReturnUser)
      }
    }
    catch(e) {
      res.json({error:e})
    }
  },

  removeDadosUsuario : async (req,res) => {
    try {
      const {ID,Administrador} = req.dataUser;
      const {userToBeDeletedID} = req.body;

      console.log(userToBeDeletedID)
      console.log(Administrador)

      if(userToBeDeletedID && Administrador === 1) {
        const sendingRequestRemoveUser = await userInteractQueries.removeDadosUsuarioQuery(ID,userToBeDeletedID);
        res.json(sendingRequestRemoveUser)
      } 
      else {
        const sendingRequestToDeletYourself = await userInteractQueries.removeDadosFuncionarioQuery(ID);
        res.json(sendingRequestToDeletYourself)
      }

    }
    catch(e) {
      return {error:e}
    }
  },


  editaDadosCadastrais: async (req,res) => {
    const {ID} = req.dataUser;
    const {NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero,Bairro,Estado,Cidade} = req.body;
    try {
      if(ID) {
        const hashedNewPassword = await bcrypt.hash(Senha, 10); 
        const newUserGenerate = new Usuario(ID,NomeUsuario,DataNasc,Email,hashedNewPassword,Cep,Rua,Numero,Bairro,Estado,Cidade)
        const sendingDataEdited = await userInteractQueries.editaDadosCadastraisQuery(newUserGenerate)
        res.json(sendingDataEdited)
      }else {
        res.json({error:"falta informações para ser enviado "})
      }
    }catch (e) {
      res.json({error:e})
    }
  }
}

module.exports = userInteractController