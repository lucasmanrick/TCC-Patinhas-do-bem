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
        return res.json(requestInvite)
      }

    }
    catch(e) {
      return res.json({error:e.message})
    }
  },

  removeSolicitacaoDeAmizade: async (req,res) => {
    try{
      const {inviteID} = req.body;

      if(inviteID) {
        const sendRemoveRequisition = await userInteractQueries.removeSolicitacaoDeAmizadeQuery(inviteID);
        return res.json(sendRemoveRequisition)
      }else {
        return res.json({error:"você não especificou uma solicitação de amizade que há de ser excluida."})
      }
    }catch (e) {
      return res.json({error:e.message})
    }
  },

  minhasSolicitacoes: async(req,res) => {
    try{
      const {ID} = req.dataUser;

      if(ID) {
        const getMyInvites = await userInteractQueries.minhasSolicitacoesQuery(ID)
        return res.json(getMyInvites)
      }
    }
    catch(e) {
      return res.json({error:e.message})
    }
  },

  aceitaSolicitacao: async(req,res) => {
    const {ID} = req.dataUser;
    const {inviteID} = req.body;
    try {
      if(ID && inviteID) {
        const acceptInviteRequest = await userInteractQueries.aceitaSolicitacaoQuery(ID,inviteID);
        return res.json(acceptInviteRequest)
      }else {
        return res.json({error:"faltam informações para que a solicitação de amizade desejada seja aceita"})
      }
    }catch(e) {
      return res.json({error:e.message})
    }
  },

  profileUser: async(req,res) => {
    const {ID} = req.dataUser;
    try {
      const {userBeReturnedID} = req.body;


      if(userBeReturnedID) {
        const dataReturnUserEspecified = await userInteractQueries.profileUserQuery(userBeReturnedID,ID)
        return res.json(dataReturnUserEspecified)
      }else {
        const dataReturnUser = await userInteractQueries.profileUserQuery(null,ID)
        return res.json(dataReturnUser)
      }
    }
    catch(e) {
      return res.json({error:e.message})
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
        return res.json(sendingRequestRemoveUser)
      } 
      else {
        const sendingRequestToDeletYourself = await userInteractQueries.removeDadosUsuarioQuery(ID);
        return res.json(sendingRequestToDeletYourself)
      }

    }
    catch(e) {
      return res.json({error:e.message})
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
        return res.json(sendingDataEdited)
      }else {
        return res.json({error:"falta informações para ser enviado "})
      }
    }catch (e) {
      return res.json({error:e.message})
    }
  },

  removeUsuarioDaListaDeContatos:async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {IDContato} = req.body;

      if(ID && IDContato) {
        const sendRequestRemoveContact = await userInteractQueries.removeUsuarioDaListaDeContatosQuery(IDContato,ID)
        return res.json(sendRequestRemoveContact)
      }else {
        return res.json({error:"não foi possivel remover o usuário da lista de contato pois não falta informações para ser feito a requisição"})
      }
    }catch(e) {
      return res.json({error:e.message})
    }
  },

  meusContatos: async (req,res) => {
    const {ID} = req.dataUser;
    try {
      if(!ID) return res.json({error:"não é possivel puxar os contatos, pois não foi especificado o Usuário"})
       const takeUsersOnMyContacts = await userInteractQueries.meusContatosQuery(ID);
       return res.json(takeUsersOnMyContacts)
    }catch(e) {
      return res.json({error:e.message})
    }
  },


  mensagensContato: async(req,res) => {
    const {ID} = req.dataUser;
    const {IDContato} = req.body;
    try {
      if(ID && IDContato) {
        const getMessagesWithMyContact = await userInteractQueries.mensagensContatoQuery(ID,IDContato)
        return res.json(getMessagesWithMyContact)
      }else {
        return res.json({error:"não foi informado os dados necessários para retornar mensagens com este contato"})
      }
      
    }catch(e) {
      return res.json({error:e.message})
    }
  },

  enviaMensagem: async (req,res) => {
    const {ID} = req.dataUser;
    const {IDContato,Remocao,Texto} = req.body;
    const DataDeEnvio = new Date();
    try{
      if(ID && IDContato) {
       const sendRequestMessageToUser = await userInteractQueries.enviaMensagemQuery(DataDeEnvio,ID,IDContato,Texto)
      return res.json(sendRequestMessageToUser)
      }else {
        return res.json({error:"não foi informado todos dados necessários para fazer o envio da mensagem"})
      }
    }catch(e) {
      return res.json({error:e.message})
    }
  },

  deletaMensagemEnviada: async (req,res) => {
    const {ID} = req.dataUser;
    const {MessageID} = req.body;
    try {
       if(!ID,!MessageID) return res.json({error:"não foi informado todos dados necessários para exlusão da mensagem"})
       return res.json(await userInteractQueries.deletaMensagemEnviadaQuery(ID,MessageID))
    }catch(e) {
      return res.json({error:e.message})
    }
  }
}

module.exports = userInteractController