const Pet = require("../Models/Class/Pet.js")

const petManagement = {
  cadastraPet: async (req, res) => {
  try {
    const IDDoador = req.dataUser.ID; // Certifique-se de que o middleware de autenticação está preenchendo req.dataUser
    const { TipoAnimal, Linhagem, Idade, Sexo, Cor, Descricao } = req.body;

    if (TipoAnimal && Linhagem && Idade && Sexo && Cor && Descricao) {
      const createPetForm = new Pet(new Date(), TipoAnimal, Linhagem, null, Idade, Sexo, Cor, Descricao, IDDoador);
      const newPetCreate = await createPetForm.cadastraPetQuery();
      res.json(newPetCreate);
    } else {
      console.log("Não passou");
      res.json({ error: "Não foi possível fazer o cadastro do pet, faltam informações a respeito do pet." });
    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ error: "Erro ao cadastrar pet." });
  }
},


  editaPetInfo: async(req,res) => {
    try{
      const IDDoador = req.dataUser.ID
      const {TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,PetID} = req.body;
      if(TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador,PetID) {
        const petFormDataEdit = new Pet (new Date(),TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador,PetID);
        const editDataPet = await petFormDataEdit.editPetInfoQuery(petFormDataEdit)

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
        const sendValidations = await Pet.removePetDaAdocaoQuery(IDDoador,PetID,VerifyForm)
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
        const callBackRequisition = await Pet.petsDeUmUsuarioQuery(UserID)
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
        const receivePets = await Pet.petsParaAdocaoQuery(Estado,ID);
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

      console.log(req.dataUser)

      if(ID,PetID) {
        const intrest = await Pet.demonstrarInteresseEmPetQuery(ID,PetID)
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
      const analyzeIntrest = await Pet.interessadosMeuPetQuery(MeuPetID);
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
      const myInterests = await Pet.meusInteressesQuery(ID)
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
      const removeInterest = await Pet.removerInteressePetQuery(PetID,ID);
      res.json({removeInterest})
    }
    catch (e) {
      res.json({error:e})
    }
  }
}


module.exports = petManagement