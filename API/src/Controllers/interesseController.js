


const interesseController = {

  demonstrarInteresseEmPet: async (req,res) => {
    try {
      const {ID} = req.dataUser;
      const {PetID} = req.body;

      if(ID,PetID) {
        const intrest = await Pet.demonstrarInteresseEmPetQuery(ID,PetID)
        return res.json(intrest)
      }else{
        return res.json({error:"não foi informado todos dados necessários para demonstrar interesse em um pet"})
      }
    }
    catch(e) {
      return res.json({error:e.message})
    }
  }

  
}