const Postagem = require("../Models/Class/Postagem");


const postagemController = {
  criaPostagem: async (req, res) => {
    const { ID } = req.dataUser;
    const { Descricao } = req.body;
    try {
      const dataPublicacao = new Date();

      if (ID && Descricao && dataPublicacao) {
        const newPost = new Postagem(null, Descricao, dataPublicacao, ID);
        return res.json(await newPost.criarPostagemQuery());
      }
    } catch (e) {
      return res.json({ error: e.message })
    }
  },

  editarPostagem: async (req, res) => {
    const { ID } = req.dataUser;
    const { IDPostagem, Descricao } = req.body;
    try {
      if (ID && IDPostagem && Descricao) {
        const editPost = new Postagem(IDPostagem, Descricao, null, ID)
        return res.json(await editPost.editarPostagemQuery())
      }
    } catch (e) {
     return res.json({ error: e.message })
    }
  },


  verPostagens: async (req,res) => {
    const {ID} = req.dataUser;
    const {gapQuantity} = req.body
    try{
     return res.json(await Postagem.verPostagensQuery(gapQuantity,ID))
      // if(quantityGet) {
       
      // }
    }catch(e){
      res.json({error:e.message})
    }
  }
}

module.exports = postagemController;