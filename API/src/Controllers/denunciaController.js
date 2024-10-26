const Denuncia = require("../Models/Class/Denuncia");

const denunciaController = {
  denunciarPostagem: async (req,res) => {
    const {ID} = req.dataUser;
    const {Causa,IDPostagem} = req.body;
    try {
      if(Causa === "conteudo repulsivo" || Causa === "nao me interessou" || Causa === "usuario problema") {
        if(ID && IDPostagem ) {
          const newDenunciate = new Denuncia (Causa,ID,IDPostagem);
          return res.json (await newDenunciate.denunciarPostagemQuery())
        }
        return res.json({error:"não foi possivel denunciar conteudo pois não chegaram todos dados necessários para a denuncia"})

      }return res.json({error:"a CAUSA da denuncia não está padronizada"})
     
    }catch(e) {
      res.json({error:e.message})
    }
  }
}


module.exports = denunciaController;