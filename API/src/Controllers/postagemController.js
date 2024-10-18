const Postagem = require("../Models/Class/Postagem");


const postagemController = {
  criaPostagem: async (req,res) => {
    const {ID} = req.dataUser;
    const {Descricao} = req.body;
    try {
      const dataPublicacao = new Date();

      if(ID && Descricao && dataPublicacao) {
        const newPost = new Postagem(null,Descricao,dataPublicacao,ID);
        return res.json(await newPost.criarPostagemQuery());
      }
    }catch(e) {
      return res.json({error:e.message})
    }
  }
}

module.exports = postagemController;