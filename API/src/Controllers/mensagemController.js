const Mensagem = require("../Models/Class/Mensagem")


const mensagemController  = {

  mensagensContato: async(req,res) => {
    const {ID} = req.dataUser;
    const {IDContato} = req.params;
    try {
      if(ID && IDContato) {
        const getMessagesWithMyContact = await Mensagem.mensagensContatoQuery(ID,IDContato)
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
    const {IDContato,Texto} = req.body;
    const DataDeEnvio = new Date();
    try{
      if(ID && IDContato) {
       const sendRequestMessageToUser = await Mensagem.enviaMensagemQuery(DataDeEnvio,ID,IDContato,Texto)
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
       return res.json(await Mensagem.deletaMensagemEnviadaQuery(ID,MessageID))
    }catch(e) {
      return res.json({error:e.message})
    }
  }
}

module.exports = mensagemController