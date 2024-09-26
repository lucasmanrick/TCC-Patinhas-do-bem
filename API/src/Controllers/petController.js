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
      const {UserID} = req.body  //ATENTE-SE O USERID ESTÁ SENDO PASSADO NO BODY NESSA REQUISIÇÃO
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
      const {ID,Estado} = req.dataUser;

      console.log(Estado,ID)
      if(Estado,ID) {
        const receivePets = await petQueries.petsParaAdocaoQuery(Estado,ID);
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

  demonstrarInteresseEmPet: async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {PetID} = req.body;

      if(ID,PetID) {
        console.log(ID)
        const intrest = await petQueries.demonstrarInteresseEmPetQuery(ID,PetID)
        res.json(intrest)
      }else{
        res.json({error:"não foi informado todos dados necessários para demonstrar interesse em um pet"})
      }

  

    }
    catch(e) {
      res.json({error:e})
    }
  },

  interessadosMeuPet: async (req,res) => {
    try{
     const {MeuPetID} = req.body;

     if(MeuPetID) {
      const analyzeIntrest = await petQueries.interessadosMeuPetQuery(MeuPetID);
      res.json(analyzeIntrest)

     }else {
      res.json({error:"não foi informado o id do pet para identificar os interessados no mesmo."})
     }

     

    }
    catch(e) {
      res.json ({error:e})
    }
  },

  meusInteresses: async(req,res) => {
    try {
      const {ID} = req.dataUser;
      const myInterests = await petQueries.meusInteressesQuery(ID)
      res.json(myInterests)
    }
    catch (e) {
      res.json({error:e})
    }
  },

  removerInteressePet: async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {PetID} = req.body;
      petQueries.removerInteressePetQuery()
    }
    catch (e) {
      res.json({error:e})
    }
  }
}


module.exports = petManagement