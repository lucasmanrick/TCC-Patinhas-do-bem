const Pet = require("../../Models/Class/Pet.js")
const petQueries = require ("../Models/Query/petQueries.js")

const petManagement = {
  cadastraPet: async (req,res)=> {
    const {ID,Nome,CEP,Rua,Numero,Bairro,Estado,DataNasc,Email,Administrador,Cidade} = req.dataUser
    const createPetForm = new Pet(ID,Nome,CEP,Rua,Numero,Bairro,Estado,DataNasc,Email,Administrador,Cidade)
  }

}


module.exports = petManagement