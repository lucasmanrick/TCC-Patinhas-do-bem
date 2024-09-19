const connection = require("../../Config/db.js");


const petQueries = {
  async cadastraPetQuery (petForm) {
    const conn = await connection();

    try {
      const insertNewPet = await conn.query('insert into pet (dataRegistro,TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador) VALUES (?,?,?,?,?,?,?,?,?)',[petForm.dataRegistro,petForm.TipoAnimal,petForm.Linhagem,1,petForm.Idade,petForm.Sexo,petForm.Cor,petForm.Descricao,petForm.IDDoador])
      
    }
    catch(e) {
      return ({error:e})
    }
  }
}

module.exports = petQueries;