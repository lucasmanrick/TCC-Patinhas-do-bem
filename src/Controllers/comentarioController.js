const Comentario = require("../Models/Class/Comentario");


const comentarioController = {
  comentarEmUmPost: async (req,res) => {
    const {ID} = req.dataUser;
    const {IDPostagem,Texto} = req.body;
    try {
      if(ID&&IDPostagem&&Texto != '') {
        const newComment = new Comentario(null,Texto,new Date(),IDPostagem,ID)
        return res.json(await newComment.comentarEmUmPostQuery())
      }return res.json ({error:"não foi possivel enviar a mensagem pois faltam informações para completar o processo."})
    }catch(e) {
      res.json({error:e.message})
    }
  }
}


module.exports = comentarioController