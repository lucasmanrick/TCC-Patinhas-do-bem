const Usuario = require("../Models/Class/Usuario");
const UsuariosBloqueados = require("../Models/Class/UsuariosBloqueados");

const UsuariosBloqueadosController = {
  pegaUsuarioBloqueadoPeloID: async (req,res) => {
    const {userID} = req.body;
    try{
      if(!userID) return req.json ({error:"não foi informado os dados necessários para que a requisição fosse completada"})
        const reqUserVerifyBlock = await UsuariosBloqueados.pegaUsuarioBloqueadoPeloIDQuery(userID)
        return res.json(reqUserVerifyBlock)
    }catch(e) {
      res.json({error:e.message})
    }
  },


  bloquearUmUsuario: async (req,res) => {
    const {ID} = req.dataUser;
    const {IDBloqueado} = req.body;
    try {
      if (ID && IDBloqueado) {
       const reqBlock = await Usuario.bloquearUmUsuarioQuery(ID,IDBloqueado)
       return res.json(reqBlock)
      }
    }catch (e) {
      res.json({error:e.message})
    }
  },


  retirarBloqueioUsuario: async (req,res) => {
    const {ID} = req.dataUser;
    const IDBloqueado = req.body;
    try {
      if(ID && IDBloqueado) {
        const sendingRequest = await UsuariosBloqueados.retirarBloqueioUsuarioQuery(ID,IDBloqueado)
       return res.json(sendingRequest)
      }return res.json ({error:"não foi possivel completar ação, pois não foi informado os dados necessários para completar a requisição."})
    }
    catch(e) {
      res.json({error:e.message})
    }
  }
}


module.exports = UsuariosBloqueadosController