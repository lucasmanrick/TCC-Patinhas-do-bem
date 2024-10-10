const Interesse = require("../Models/Class/Interesse")


const interesseController = {

  demonstrarInteresseEmPet: async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {PetID} = req.body;

      if(ID,PetID) {
        const intrest = await Interesse.demonstrarInteresseEmPetQuery(ID,PetID)
        return res.json(intrest)
      }else{
        return res.json({error:"não foi informado todos dados necessários para demonstrar interesse em um pet"})
      }
    }
    catch(e) {
      return res.json({error:e.message})
    }
  },

  interessadosMeuPet: async (req,res) => {
    try{
     const {MeuPetID} = req.body;

     if(MeuPetID) {
      const analyzeIntrest = await Interesse.interessadosMeuPetQuery(MeuPetID);
      return res.json(analyzeIntrest)
     }else {
      return res.json({error:"não foi informado o id do pet para identificar os interessados no mesmo."})
     }

     

    }
    catch(e) {
     return res.json ({error:e.message})
    }
  },

  meusInteresses: async(req,res) => {
    try {
      const {ID} = req.dataUser;
      const myInterests = await Interesse.meusInteressesQuery(ID)
      return res.json(myInterests)
    }
    catch (e) {
      return res.json({error:e.message})
    }
  },

  removerInteressePet: async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {PetID} = req.body;
      const removeInterest = await Interesse.removerInteressePetQuery(PetID,ID);
      return res.json({removeInterest})
    }
    catch (e) {
      return res.json({error:e.message})
    }
  }
}



module.exports = interesseController