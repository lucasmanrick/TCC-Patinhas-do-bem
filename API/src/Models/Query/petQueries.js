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
  }
}

module.exports = petQueries;