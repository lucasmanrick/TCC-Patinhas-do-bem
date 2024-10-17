const Denuncia = require("../Models/Class/Denuncia");

const denunciaController = {
  denunciarPostagem: async (req,res) => {
    const {ID} = req.dataUser;
    const {Causa,IDPostagem} = req.body;
    try {
      if(ID && IDPostagem) {
        const newDenunciate = new Denuncia (Causa,ID,IDPostagem);
        return res.json (await newDenunciate.denunciarPostagemQuery())
      }
    }catch(e) {
      res.json({error:e.message})
    }
  }
}


module.exports = denunciaController;