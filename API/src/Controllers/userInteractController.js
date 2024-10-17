
const userInteractQueries = require("../Models/Query/userInteractQueries");
const bcrypt = require('bcrypt');


const userInteractController = {
  

  profileUser: async(req,res) => {
    const {ID} = req.dataUser;
    try {
      const {userBeReturnedID} = req.body;


      if(userBeReturnedID) {
        const dataReturnUserEspecified = await userInteractQueries.profileUserQuery(userBeReturnedID,ID)
        return res.json(dataReturnUserEspecified)
      }else {
        const dataReturnUser = await userInteractQueries.profileUserQuery(null,ID)
        return res.json(dataReturnUser)
      }
    }
    catch(e) {
      return res.json({error:e.message})
    }
  }
}

module.exports = userInteractController