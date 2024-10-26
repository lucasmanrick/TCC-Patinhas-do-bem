const Avaliacao = require("../Models/Class/Avalicacao");

const avaliacaoController = {
  reagirPostagem: async (req,res) => {
    const {ID} = req.dataUser;
    const {IDPostagem,tipo} = req.body;
    try{
      if(tipo === 'uau' || tipo === 'like' || tipo === 'amei'){
        if(ID && IDPostagem ) {
          const newReaction = new Avaliacao(null,tipo,IDPostagem,ID) 
          const receiveReturnAction = await newReaction.reagirPostagemQuery()
          return res.json (receiveReturnAction)
        }
        return res.json({error:"está faltando informações para que seja completado a requisição"})
      }
      return res.json({error:"o campo tipo não está com um valor valido, tente novamente"})
      
    }catch(e) {
      return res.json({error:e.message})
    }
  },

  removerReacao: async (req,res) => {
    const {ID} = req.dataUser;
    const {IDPostagem} = req.body;
    try {
      if(ID && IDPostagem) {
        const waitingResponse = await Avaliacao.removerReacaoQuery(ID,IDPostagem)
        return res.json(waitingResponse)
      }
    }catch(e) {
      return  res.json({error:e.message})
    }
  }
  

}


module.exports = avaliacaoController