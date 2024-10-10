
const userInteractQueries = require("../Models/Query/userInteractQueries");
const bcrypt = require('bcrypt');


const userInteractController = {
  

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