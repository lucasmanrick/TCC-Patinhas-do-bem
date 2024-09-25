const {connection} = require("../../Config/db");


const petQueries = {
  async cadastraPetQuery (petForm) {
    const conn = await connection()
    try {
      const insertNewPet = await conn.query('insert into pet (dataRegistro,TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador) VALUES (?,?,?,?,?,?,?,?,?)',[petForm.dataRegistro,petForm.TipoAnimal,petForm.Linhagem,petForm.Status,petForm.Idade,petForm.Sexo,petForm.Cor,petForm.Descricao,petForm.IDDoador])
      if(insertNewPet[0].insertId) {
        
        return {sucess:"pet cadastrado com sucesso", idDoPet:insertNewPet[0].insertId}
      }else {
        return {error:"não foi possivel cadastrar o pet no banco de dados."}
      }
    }
    catch(e) {
      return ({error:e})
    }
  },
  async editPetInfoQuery (petForm) {
    const conn = await connection();
    try {
     const responseForEditRequest = await conn.query ("UPDATE pet SET TipoAnimal=?, Linhagem=?, Idade=?,Sexo=?,Cor=?,Descricao =? WHERE ID = ? && IDDoador = ?", [petForm.TipoAnimal,petForm.Linhagem,petForm.Idade,petForm.Sexo,petForm.Cor,petForm.Descricao,petForm.PetID,petForm.IDDoador])
     if(responseForEditRequest[0].affectedRows >= 1) {
      return {sucess:"Editado informações do pet solicitado"}
     }else {
      return {sucess:"Não foi identificado o pet especificado portanto não foi alterado informações do pet"}
     }
    }
    catch(e) {
      return {error:e}
    }
  },
  async removePetDaAdocaoQuery (IDDoador,PetID,VerifyForm) {
    const conn = await connection();

    try {
      if(VerifyForm.weHelp == true && VerifyForm.wallCheck == true) {
        const inactivatePet = await conn.query("UPDATE pet SET status = ? WHERE ID = ? AND IDDoador = ?", [0,PetID,IDDoador])
        if(inactivatePet[0].affectedRows >= 1) {
          return {sucess:"O pet foi inativado e vai para nosso mural de pets adotados graças a rede social"}
        }else {
          return {error:"não foi modificado nenhum registro verifique as informações e tente novamente"}
        }
      }else {
        const removePet = await conn.query("DELETE FROM pet WHERE ID=? AND IDDoador = ?",[PetID,IDDoador])
        if(removePet[0].affectedRows >= 1) {
          return {sucess:"Todos dados a respeito do pet foram removidos de nosso sistema."}
        }else {
          return {error:"não foi identificado um registro com os dados especificados"}
        }
      }

    } catch(e) {
      return {error:e}
    }
   
  },

  async petsDeUmUsuarioQuery (UserID) {
    const conn = await connection();
    try {
      const getUserPets = await conn.query("SELECT * FROM PET where IDDoador = ?", [UserID]);
      if(getUserPets[0].length >= 1) {
        
        getUserPets[0].forEach ((e) => {
         delete e.IDDoador
        })

       return {sucess:"Retornando todos pets do usuário especificado", dataResponse: getUserPets[0]}
      }else {
        return {error:"O usuário especificado não possui nenhum pet cadastrado."}
      }
    }
    catch(e) {
      return {error:e}
    }
  },


  async petsParaAdocaoQuery (Estado) {
    const conn = await connection();
    try {
     const verifyUsersClose = await conn.query ("select p.* from pet as p join usuario as u WHERE u.estado = ?", [Estado]);
      console.log(verifyUsersClose)
     return {sucess:"retornando todos pets da proximidade do usuário", dataResponse:verifyUsersClose[0]}
    }
    catch (e) {
      return {error:e}
    }
  },


  async DemonstrarInteresseEmPetQuery (UserID,PetID) {
    const conn = await connection();
    try{
      const verifyExistencePet = await conn.query ("SELECT * FROM PET WHERE ID = ?",[PetID])
      const verifyExistenceUser = await conn.query ("SELECT * FROM Usuario WHERE ID = ?",[UserID])

      if(verifyExistencePet[0].length >=1 && verifyExistenceUser[0].length >= 1) {
        const intrestSendRequest = await conn.query("Insert into interesse (Status,IDInteressado,IDPet) values (?,?,?)",[1,UserID,PetID])
        if(intrestSendRequest[0].affectedRows >= 1) {
          return {sucess:"Usuário demonstrou interesse em um pet novo com sucesso"}
        }else {
          return {error:"não foi demonstrado interesse em nenhum pet pois houve um problema no sistema, tente novamente!"}
        }
      }else {
        return {error:"usuário informado ou pet não existem, portanto não foi possivel demonstrar interesse neste pet informado."}
      }

      
    }
    catch(e) {
      return {error:e}
    }
  }
  
}

module.exports = petQueries;