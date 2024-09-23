const Pet = require("../Models/Class/Pet.js")
const petQueries = require ("../Models/Query/petQueries.js")

const petManagement = {
  cadastraPet: async (req,res)=> {
    try {
      const IDDoador = req.dataUser[0].ID
      const {TipoAnimal,Linhagem,Idade,Sexo,Cor,Descricao} = req.body      
      if(TipoAnimal,Linhagem,Idade,Sexo,Cor,Descricao) {
        const createPetForm = new Pet(new Date(),TipoAnimal,Linhagem,null ,Idade,Sexo,Cor,Descricao,IDDoador)
        const newPetCreate = await petQueries.cadastraPetQuery(createPetForm)
        res.json (newPetCreate)
      }else {
        console.log("nao passou")
        res.json ({error:"não foi possivel fazer o cadastro do pet, faltam informações a respeito do pet."})
      }
      
    } catch(e) {
      res.json ({error:e})
    } 
  },

  editaPetInfo: async(req,res) => {
    try{
      const IDDoador = req.dataUser[0].ID
      const {TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,PetID} = req.body;
      if(TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador,PetID) {
        const petFormDataEdit = new Pet (new Date(),TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador,PetID);
        const editDataPet = await petQueries.editPetInfoQuery(petFormDataEdit)

        res.json (editDataPet)
      }else {
        res.json({error:"faltou dados para que seja feita a edição correta das informações do pet"})
      }
    }
    catch(e) {
      res.json ({error:e})
    }
  },

  removePetDaAdocao: async(req,res) => {
    
  }
}


module.exports = petManagement