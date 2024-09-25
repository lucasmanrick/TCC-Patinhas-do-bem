const Pet = require("../Models/Class/Pet.js")
const petQueries = require ("../Models/Query/petQueries.js")

const petManagement = {
  cadastraPet: async (req,res)=> {
    try {
      const IDDoador = req.dataUser.ID
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
      const IDDoador = req.dataUser.ID
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
    try {
      const IDDoador = req.dataUser.ID
      const {PetID,VerifyForm} = req.body

      if(IDDoador,PetID,VerifyForm) {
        const sendValidations = await petQueries.removePetDaAdocaoQuery(IDDoador,PetID,VerifyForm)
        res.json(sendValidations)
      } else {
        res.json({error:"está faltando informações para a remoção do pet da adoção."})
      }
    }
    catch(e) {
      res.json({error:e})
    }
  },

  petsDeUmUsuario: async (req,res) => {
    try {
      const {UserID} = req.body
      if(UserID && typeof(UserID) !== 'string') {
        const callBackRequisition = await petQueries.petsDeUmUsuarioQuery(UserID)
        res.json(callBackRequisition)
      }
    }
    catch (e) {
      res.json({error:e})
    }
  },

  petsParaAdocao: async (req,res) => {
    try {
      const {Estado} = req.dataUser;

      if(Estado) {
        const receivePets = await petQueries.petsParaAdocaoQuery(Estado);
        res.json(receivePets)
      }
      else {
        res.json({error:"não foi possivel identificar a localidade do usuário para puxar pets da proximidade"})
      }

    }
    catch (e) {
      res.json({error:e})
    }
  },

  DemonstrarInteresseEmPet: async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {PetID} = req.body;

      if(ID,PetID) {
        const intrest = await petQueries.DemonstrarInteresseEmPetQuery(ID,PetID)
        res.json(intrest)
      }else{
        res.json({error:"não foi informado todos dados necessários para demonstrar interesse em um pet"})
      }

  

    }
    catch(e) {
      res.json({error:e})
    }
  },

  
}


module.exports = petManagement