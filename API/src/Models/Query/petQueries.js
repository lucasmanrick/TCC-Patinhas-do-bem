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
     console.log(petForm)
     const responseForEditRequest = await conn.query ("UPDATE pet SET TipoAnimal=?, Linhagem=?, Idade=?,Sexo=?,Cor=?,Descricao =? WHERE ID = ? && IDDoador = ?", [petForm.TipoAnimal,petForm.Linhagem,petForm.Idade,petForm.Sexo,petForm.Cor,petForm.Descricao,petForm.PetID,petForm.IDDoador])
     return {sucess:responseForEditRequest}
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
   
  }
}

module.exports = petQueries;